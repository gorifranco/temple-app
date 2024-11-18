package handlers

import (
	"net/http"
	"temple-app/models"
	"time"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
)


// @Summary Get all reservations
// @Description Retrieves all the reservations from the database.
// @Security Bearer
// @Tags Reservations
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.ReservaResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/reserves [get]
func (h *Handler) IndexReserva(c *gin.Context) {
	var reserves []models.ReservaResponse
	h.DB.Table("reserves").Select("id, usuari_id as usuariID, hora as hora, confirmed as confirmed").Scan(&reserves)

	jsonData, _ := json.Marshal(reserves)
	fmt.Println(string(jsonData))

	c.JSON(http.StatusOK, models.SuccessResponse{Data: reserves})
}

// @Summary Creates a new reservation
// @Description Creates a new reservation in the database.
// @Security Bearer
// @Tags Reservations
// @Accept json
// @Produce json
// @Param input body models.ReservaInput true "Reservation to create"
// @Success 200 {object} models.SuccessResponse{data=models.ReservaResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/reserves [post]
func (h *Handler) CreateReserva(c *gin.Context) {
	var input models.ReservaInput
	var usuari models.Usuari
	var err error

	// Parsear JSON
	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}
	// Si se envía el campo Usuari
	if input.UsuariID != nil {
		// Comprobar si el usuario existe
		if err = h.DB.Where("id = ?", *input.UsuariID).First(&usuari).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "Usuario no encontrado"})
			return
		}

		// Verificar que el usuario es su entrenador
		if c.MustGet("user").(*models.Usuari).ID == *usuari.EntrenadorID {
			// Crear reserva
			tmp := time.Date(input.Hora.Year(), input.Hora.Month(), input.Hora.Day(), input.Hora.Hour(), input.Hora.Minute(), 0, 0, time.Local)
			reserva := models.Reserva{Hora: tmp, UsuariID: *input.UsuariID, EntrenadorID: c.MustGet("user").(*models.Usuari).ID}
			 if err = h.DB.Create(&reserva).Error; err != nil {
				c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Error al crear reserva"})
				return
			}
			response := models.ReservaResponse{}
			h.DB.Table("reserves").Where("id = ?", reserva.ID).Scan(&response)
			c.JSON(http.StatusOK, models.SuccessResponse{Data: response})
			return
		}
	}
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
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Error en la consulta SQL"})
		return
	}

	// Si ya se alcanzó el máximo número de alumnos
	if !isBelowMax {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Número máximo de alumnos alcanzado para esta hora"})
		return
	}
	// Crear reserva si hay espacio disponible
	reserva := models.Reserva{
		Hora:     input.Hora,
		UsuariID: *input.UsuariID,
	}

	if err = h.DB.Create(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Error al crear la reserva"})
		return
	}

	// Respuesta de éxito
	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}

func (h *Handler) UpdateReserva(c *gin.Context) {
	var reserva models.Reserva
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	var input models.ReservaInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	updatedReserva := models.Reserva{Hora: input.Hora}

	h.DB.Model(&reserva).Updates(&updatedReserva)

	var uu models.ReservaResponse
	h.DB.Preload("Usuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, models.SuccessResponse{Data: uu})
}

func (h *Handler) DeleteReserva(c *gin.Context) {
	var reserva models.Reserva
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	if err = h.DB.Delete(&reserva).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Error borrant la reserva"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Get all reservations of an entrenador
// @Description Retrieves all the reservations of an entrenador from the database.
// @Tags Reservations
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.ReservaResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/reservations/reservationsEntrenador [get]
func (h *Handler) ReservesEntrenador(c *gin.Context) {
	var reserves []models.ReservaResponse
	var err error

	if err = h.DB.Table("reserves").Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).Where("hora >= ?", time.Now().
	Truncate(24*time.Hour)).Select("id, usuari_id, hora, confirmada").Scan(&reserves).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	
	if reserves == nil{
		reserves = []models.ReservaResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: reserves})
}
