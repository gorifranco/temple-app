package handlers

import (
	"net/http"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

// @Summary Get the configuration of the trainer
// @Description Retrieves the configuration of the trainer from the database.
// @Tags Entrenador
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=models.ConfiguracioEntrenadorResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/configuracioEntrenador [get]
func (h *Handler) FindConfiguracioEntrenador(c *gin.Context) {
	var configuracio models.ConfiguracioEntrenador
	var horaris []models.HorarisEntrenador
	var horariResposta []models.HorariResponse
	var err error

	//If user is a trainer will retrieve his own configuration
	if c.MustGet("user").(*models.Usuari).TipusUsuariID == 3 {
		//Gets the config
		if err = h.DB.Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).First(&configuracio).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "Configuració no trobada"})
			return
		}

		//Gets the shwdules
		if err = h.DB.Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).Find(&horaris).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "Horaris no trobats"})
			return
		}
		
		//Creates the response of the shedule
		for _, h := range horaris {
			if h.DiaSetmana == 0 {
				c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "DiaSetmana no vàlid"})
				return
			}
			horariResposta = append(horariResposta, models.HorariResponse{
				ID:          h.ID,
				DiaSetmana:  uint(h.DiaSetmana),
				Desde:       h.Desde.Format("15:04"),
				Fins:        h.Fins.Format("15:04"),
			})
		}

		//Retrieves the response
		c.JSON(http.StatusOK, models.SuccessResponse{Data: models.ConfiguracioEntrenadorResponse{
			DuracioSessions:     configuracio.DuracioSessions,
			MaxAlumnesPerSessio: configuracio.MaxAlumnesPerSessio,
			Horaris:             horariResposta,
		}})
		return
	}

	//Is user is no a trainer will retireve the config of his trainer
	if(c.MustGet("user").(*models.Usuari).EntrenadorID == nil) {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "No tens entrenador assignat"})
	}

	//Gets the shedules of the trainer
	if err = h.DB.Where("entrenador_id = ?", *c.MustGet("user").(*models.Usuari).EntrenadorID).Find(&horaris).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	//Gets the config of the trainer
	if err = h.DB.Where("entrenador_id = ?", *c.MustGet("user").(*models.Usuari).EntrenadorID).First(&configuracio).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}
	
	//Creates the response of the shedule
	for _, h := range horaris {
		if h.DiaSetmana == 0 {
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "DiaSetmana no vàlid"})
			return
		}
		horariResposta = append(horariResposta, models.HorariResponse{
			ID:          h.ID,
			DiaSetmana:  uint(h.DiaSetmana),
			Desde:       h.Desde.Format("15:04"),
			Fins:        h.Fins.Format("15:04"),
		})
	}
	
	//Retrieves the response
	c.JSON(http.StatusOK, models.SuccessResponse{Data: models.ConfiguracioEntrenadorResponse{
		DuracioSessions:     configuracio.DuracioSessions,
		MaxAlumnesPerSessio: configuracio.MaxAlumnesPerSessio,
		Horaris:             horariResposta,
	}})
}

// @Summary Save the configuration of the trainer
// @Description Saves the configuration of the trainer in the database.
// @Tags Entrenador
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.ConfiguracioEntrenadorInput true "Configuracio to save"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/guardarConfiguracioEntrenador [post]
func (h *Handler) GuardarConfiguracioEntrenador(c *gin.Context) {
	var configuracio models.ConfiguracioEntrenadorInput
	var err error

	if err = c.ShouldBindJSON(&configuracio); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if configuracio.DuracioSessions == 0 || configuracio.MaxAlumnesPerSessio == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "DuracioSessions o MaxAlumnesPerSessio no vàlid"})
		return
	}

	if err = h.DB.Model(&models.ConfiguracioEntrenador{}).Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).
		Updates(&models.ConfiguracioEntrenador{DuracioSessions: configuracio.DuracioSessions, MaxAlumnesPerSessio: configuracio.MaxAlumnesPerSessio}).Error; err != nil {
			
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update configuracio entrenador"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Saves the schedule of the trainer
// @Description Saves the schedule of the trainer in the database.
// @Tags Entrenador
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body []models.HorarisEntrenadorInput true "Horari to save"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/guardarHorariEntrenador [post]
func (h *Handler) GuardarHorariEntrenador(c *gin.Context) {
	var horari []models.HorarisEntrenadorInput
	var horarisPrevis []models.HorarisEntrenador
	var newHorari []models.HorarisEntrenador
	var err error

	if err = c.ShouldBindJSON(&horari); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	tx := h.DB.Begin()

	if err = tx.Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).Find(&horarisPrevis).Error; err != nil{
		tx.Rollback()
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if len(horarisPrevis) > 0 {
		if err = tx.Delete(&horarisPrevis).Error; err != nil{
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete previous horaris"})
			return
		}
	}
	for _, h := range horari {
		if h.DiaSetmana < 0 || h.DiaSetmana > 6 {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "DiaSetmana no vàlid"})
			return
		}

		desde, err := time.Parse("15:04", h.Desde)
		if err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Format de 'Desde' no vàlid. Ha de ser 'hh:mm'"})
			return
		}
		desde = time.Date(2000, time.January, 1, desde.Hour(), desde.Minute(), 0, 0, time.Local)

		fins, err := time.Parse("15:04", h.Fins)
		if err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Format de 'Fins' no vàlid. Ha de ser 'hh:mm'"})
			return
		}
		fins = time.Date(2000, time.January, 1, fins.Hour(), fins.Minute(), 0, 0, time.Local)

		newHorari = append(newHorari, models.HorarisEntrenador{
			EntrenadorID: c.MustGet("id").(uint),
			DiaSetmana:   h.DiaSetmana,
			Desde:        desde,
			Fins:         fins,
		})
	}

	if err = tx.Create(&newHorari).Error; err != nil{
		tx.Rollback()
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create new horaris"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}