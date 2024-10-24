package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

// @Summary Get all pending solicitudes
// @Description Retrieves all the pending solicitudes from the database.
// @Tags Solicitudes
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.SolicitudUnioEntrenador}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/solicitudes/solicitudsEntrenador [get]
func (h *Handler) SolicitudsEntrenador(c *gin.Context) {
	var solicituds []models.SolicitudUnioEntrenadorResponse

	if err := h.DB.Table("solicituds_unio_entrenador").Select("id, usuari_id, entrenador_id").
	Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).Scan(&solicituds).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: solicituds})
}


// @Summary Create a new pending solicitude
// @Description Creates a new pending solicitude in the database.
// @Tags Solicitudes
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.SolicitudUnioEntrenadorInput true "Solicitude to create"
// @Success 200 {object} models.SuccessResponse{data=models.SolicitudUnioEntrenador}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/solicituds [post]
func (h *Handler) SolicitarUnioEntrenador(c *gin.Context) {
	var input models.SolicitudUnioEntrenadorInput
	var entrenador models.Usuari
	var err error
	var s2 models.SolicitudUnioEntrenador

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	//Entrenador no existeix
	if err = h.DB.Where("codi_entrenador = ?", input.CodiEntrenador).First(&entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if c.MustGet("user").(*models.Usuari).EntrenadorID != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "L'usuari ja té un entrenador"})
		return
	}

	solicitud := models.SolicitudUnioEntrenador{EntrenadorID: entrenador.ID, UsuariID: c.MustGet("user").(*models.Usuari).ID}

	if err = h.DB.Where("entrenador_id = ? and usuari_id = ?", entrenador.ID, c.MustGet("user").(*models.Usuari).ID).First(&s2).Error; err == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Ja hi ha una solicitud pendent"})
		return
	}

	if err = h.DB.Create(&solicitud).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Accept a pending solicitude
// @Description Accepts a pending solicitude in the database.
// @Tags Solicitudes
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the pending solicitude to accept"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/solicitudes/{id}/accept [put]
func (h *Handler) AcceptarSolicitudUnioEntrenador(c *gin.Context) {
	var entrenador models.Usuari
	var solicitud models.SolicitudUnioEntrenador
	var err error
	var usuari models.Usuari

	if err = h.DB.Where("id = ?", c.Param("id")).First(&solicitud).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "No existeix la solicitud"})
		return
	}

	if err = h.DB.Where("ID = ?", solicitud.EntrenadorID).First(entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if entrenador.ID != c.MustGet("user").(models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	//Usuari ja es troba dins el grup
	for _, alumne := range entrenador.Alumnes {
		if alumne.ID == usuari.ID {
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "L'usuari ja es troba dins la sala"})
			return
		}
	}

	//Inserir usuari en la sala
	entrenador.Alumnes = append(entrenador.Alumnes, usuari)
	 if err = h.DB.Model(&entrenador).Update("alumnes", entrenador.Alumnes).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update entrenador"})
		return
	}

	h.DB.Delete(&solicitud)

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Decline a pending solicitude
// @Description Declines a pending solicitude in the database.
// @Tags Solicitudes
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the pending solicitude to decline"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/solicitudes/{id}/decline [put]
func (h *Handler) DeclinarSolicitudUnioEntrenador(c *gin.Context) {
	var solicitud models.SolicitudUnioEntrenador
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&solicitud).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "No existeix la solicitud"})
		return
	}

	if c.MustGet("user").(models.Usuari).ID != solicitud.EntrenadorID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	if err = h.DB.Delete(&solicitud).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete solicitud"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}
