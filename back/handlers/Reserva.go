package handlers

import (
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
	var entrenador models.Usuari
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Usuari != nil {
		if err = h.DB.Where("id = ?", input.Usuari).First(&usuari).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		if c.MustGet("id").(uint) == *usuari.EntrenadorID {

			reserva := models.Reserva{Hora: input.Hora, UsuariID: *input.Usuari}

			h.DB.Create(&reserva)
			c.JSON(http.StatusOK, gin.H{"data": "success"})
			return
		}
	}

	//select count(*) from reserves where usuari_id = ? and hora = ?; -->Total de reserves per aquella hora
	//select max_alumnes_per_sessio from configuracio_entrenador where entrenador_id = ?; --> Max alumnes per sessió

	err = h.DB.Where("id = ?", c.MustGet("id").(uint)).Preload("Entrenador.HorarisEntrenador").Preload("Entrenador.ConfiguracioEntrenador").First(&entrenador).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	

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
