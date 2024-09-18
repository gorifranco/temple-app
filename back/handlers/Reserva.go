package handlers

import (
	"fmt"
	"net/http"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexReserva(c *gin.Context) {
	var reserves []models.Reserva
	h.DB.Preload("TipusUsuari").Find(&reserves)

	c.JSON(http.StatusOK, gin.H{"data": reserves})
}

func (h *Handler) FindReserva(c *gin.Context) {
	var reserva models.Reserva

	if err := h.DB.Preload("Usuari").Where("id = ?", c.Param("id")).First(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reserva})
}

func (h *Handler) CreateReserva(c *gin.Context) {
	var input models.ReservaInput
	var usuari models.Usuari
	var err error

	// Parsear JSON
	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(input.UsuariID)
	fmt.Println(input.Hora)

	// Si se envía el campo Usuari
	if input.UsuariID != nil {
		// Comprobar si el usuario existe
		if err = h.DB.Where("id = ?", input.UsuariID).First(&usuari).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
			return
		}

		// Verificar que el usuario es entrenador
		if c.MustGet("id").(uint) == *usuari.EntrenadorID {
			// Crear reserva
			fmt.Println(input.Hora)
			reserva := models.Reserva{Hora: input.Hora, UsuariID: *input.UsuariID}
			h.DB.Create(&reserva)
			c.JSON(http.StatusOK, gin.H{"data": "success"})
			return
		}
	}

	// Buscar el usuario a partir del ID del contexto
	if err = h.DB.Where("id = ?", c.MustGet("id").(uint)).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Usuario no encontrado"})
		return
	}

	fmt.Println(input.Hora)

	// Comprobar si el número de reservas en esa hora ha alcanzado el máximo
	query := `
		SELECT COUNT(*) < (
			SELECT max_alumnes_per_sessio 
			FROM configuracio_entrenador 
			WHERE entrenador_id = ?
		) 
		FROM reserves 
		WHERE entrenador_id = ? AND hora = ?;
	`

	var isBelowMax bool
	if err = h.DB.Raw(query, usuari.EntrenadorID, usuari.EntrenadorID, input.Hora).Scan(&isBelowMax).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Error en la consulta SQL"})
		return
	}

	// Si ya se alcanzó el máximo número de alumnos
	if !isBelowMax {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Número máximo de alumnos alcanzado para esta hora"})
		return
	}

	// Crear reserva si hay espacio disponible
	reserva := models.Reserva{
		Hora:        input.Hora,
		UsuariID:    *input.UsuariID,
		EntrenadorID: *usuari.EntrenadorID,
	}
	if err = h.DB.Create(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la reserva"})
		return
	}

	// Respuesta de éxito
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}


func (h *Handler) UpdateReserva(c *gin.Context) {
	var reserva models.Reserva
	if err := h.DB.Where("id = ?", c.Param("id")).First(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var input models.ReservaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedReserva := models.Reserva{Hora: input.Hora}

	h.DB.Model(&reserva).Updates(&updatedReserva)

	var uu models.Reserva
	h.DB.Preload("Usuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteReserva(c *gin.Context) {
	var reserva models.Reserva
	if err := h.DB.Where("id = ?", c.Param("id")).First(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	h.DB.Delete(&reserva)
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) ReservesEntrenador(c *gin.Context) {
	var reserves []models.Reserva
	var err error

	if err = h.DB.Where("entrenador_id = ?", c.MustGet("id").(uint)).Where("hora >= ?", time.Now().Truncate(24*time.Hour)).Find(&reserves).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reserves})
}
