package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

// @Summary Get all alumnes from  trainer
// @Description Retrieves all the alumnes of a trainer from the database.
// @Tags Entrenador
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.AlumneResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Example 200 {object} models.SuccessResponse{data=[{"ID": 4, "Nom": "Tomeu", "Alumnes": null, "TipusUsuari": "Fictici", "Reserves": [], "RutinaActual": 2, "ResultatsRutinaActual": []},]}
// @Router /api/entrenador/alumnes [get]
func (h *Handler) AlumnesEntrenador(c *gin.Context) {
	var alumnes []models.Usuari
	var err error

	if err = h.DB.Where("entrenador_id = ?", c.MustGet("user").(*models.Usuari).ID).Preload("Alumnes").Preload("TipusUsuari").Preload("Reserves").Find(&alumnes).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	query := `select ure.id as id, ure.dia as dia, ure.repeticions as repeticions, ure.series as series, ure.pes as pes,
 ure.exercici_rutina_id as exercici_rutina_id, ur.dia_actual as dia_rutrina_actual from usuari_resultat_exercici ure
  inner join usuari_rutina ur on ur.id = ure.usuari_rutina_id where ur.data_finalitzacio is null and Usuari_id = 1;`

	var resposta []models.AlumneResponse
	for _, alumne := range alumnes {
		var resultatsRutinaActual []models.UsuariResultatExerciciResponse
		var rutina models.UsuariRutina

		// Transformar Reserves a ReservaResponse
		var reservesResponse []models.ReservaResponse
		if len(reservesResponse) == 0 {
			reservesResponse = []models.ReservaResponse{}
		}
		for _, reserva := range alumne.Reserves {
			reservesResponse = append(reservesResponse, models.ReservaResponse{
				ID:         reserva.ID,
				Hora:       reserva.Hora,
				Confirmada: reserva.Confirmada,
				UsuariID:   reserva.UsuariID,
			})
		}

		err = h.DB.Where("usuari_id = ? and data_finalitzacio is null", alumne.ID).First(&rutina).Error
		tmp := models.AlumneResponse{
			ID:          alumne.ID,
			Nom:         alumne.Nom,
			TipusUsuari: alumne.TipusUsuari.Nom,
			Reserves:    reservesResponse,
		}
		if err == nil {
			tmp.RutinaActual = rutina.RutinaID
		} else {
			tmp.RutinaActual = 0
		}

		if err := h.DB.Raw(query, alumne.ID).Scan(&resultatsRutinaActual).Error; err != nil {
			tmp.ResultatsRutinaActual = []models.UsuariResultatExerciciResponse{}
		} else {
			tmp.ResultatsRutinaActual = resultatsRutinaActual
		}

		resposta = append(resposta, tmp)
	}

	if(resposta == nil){
		resposta = []models.AlumneResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: resposta})
}

// @Summary Create a student without account
// @Description Creates a new student in the database.
// @Tags Alumnes
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.UsuariFicticiInput true "Student to create"
// @Success 200 {object} models.SuccessResponse{data=models.AlumneResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/usuarisFicticis [post]
func (h *Handler) CrearUsuariFictici(c *gin.Context) {
	var input models.UsuariFicticiInput
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if input.Nom == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Nom no pot ser buit"})
		return
	}

	usuariID := c.MustGet("user").(*models.Usuari).ID
	usuari := models.Usuari{
		Nom:           input.Nom,
		EntrenadorID:  &usuariID,
		TipusUsuariID: 4,
	}

	if err = h.DB.Create(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: models.AlumneResponse{ID: usuari.ID, Nom: usuari.Nom, TipusUsuari: usuari.TipusUsuari.Nom}})
}


// @Summary Update a user without account
// @Description Updates a user in the database.
// @Tags Entrenador
// @Accept json
// @Produce json
// @Param id path int true "ID of the user to update"
// @Param input body models.UsuariInput true "User to update"
// @Success 200 {object} models.SuccessResponse{data=models.Usuari}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/usuarisFicticis/{id} [put]
func (h *Handler) UpdateUsuariFictici(c *gin.Context) {
	var usuari models.Usuari
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if usuari.TipusUsuariID != 4 || usuari.EntrenadorID != nil && *usuari.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	var input models.UsuariFicticiInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if input.Nom == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Nom no pot ser buit"})
		return
	}

	updatedUsuari := models.Usuari{Nom: input.Nom}

	if err = h.DB.Model(&usuari).Updates(&updatedUsuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update usuari"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Kiks a user from his trainer
// @Description Kiks a user from the database.
// @Tags Entrenador
// @Accept json
// @Produce json
// @Param id path int true "ID of the user to delete"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/alumnes/{id}/expulsar [put]
func (h *Handler) ExpulsarUsuari(c *gin.Context) {
	var usuari models.Usuari
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}	

	if *usuari.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	usuari.EntrenadorID = nil
	if err = h.DB.Save(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update usuari"})
		return
	}

	if usuari.TipusUsuariID == 4 {
		if err = h.DB.Delete(&usuari).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete usuari"})
			return
		}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}

/* func (h *Handler) FindAlumneEntrenador(c *gin.Context) {
	var alumne models.Usuari
	var err error
	var entrenador models.Usuari

	if err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err = h.DB.Where("id = ?", c.Param("id")).First(&alumne).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if alumne.EntrenadorID == nil || *alumne.EntrenadorID != entrenador.ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var rutina models.UsuariRutina

	h.DB.Where("UsuariID = ? and data_finalitzacio is null", alumne.ID).First(&rutina)

	var resposta = models.AlumneResponse{
		ID:           alumne.ID,
		Nom:          alumne.Nom,
		Reserves:     alumne.Reserves,
		RutinaActual: rutina.RutinaID,
	}

	c.JSON(http.StatusOK, gin.H{"data": resposta})
}
 */