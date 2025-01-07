package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

// @Summary Get rms by user
// @Description Retrieves all the rms of an user from the database.
// @Tags Rms
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RmsResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rms [get]
func (h *Handler) RmsByUser(c *gin.Context) {
	var rms []models.RmsResponse
	var user models.Usuari

	if err := h.DB.Where("id = ?", c.Param("id")).Find(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	if user.ID != c.MustGet("user").(*models.Usuari).ID || *user.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	if err := h.DB.Table("rms").Select("id, usuari_id, exercici_id, pes").Where("usuari_id = ?", user.ID).Scan(&rms).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	if rms == nil {
		rms = []models.RmsResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rms})
}

// @Sumary Get all rms of students of a trainer
// @Description Retrieves all the rms of students of a trainer from the database.
// @Tags Rms
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RmsResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rms/rmsEntrenador [get]
func (h *Handler) GetRmsEntrenador(c *gin.Context) {
	var rms []models.RmsResponse
	query := `select rms.id as id, rms.usuari_id as usuari_id, rms.exercici_id as exercici_id, rms.pes as pes
	 from rms 
	 inner join usuaris u on u.id = rms.usuari_id 
	 where u.entrenador_id = ? and rms.deleted_at is null`

	if err := h.DB.Raw(query, c.MustGet("user").(*models.Usuari).ID).Scan(&rms).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}
	if rms == nil {
		rms = []models.RmsResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rms})
}


// @Summary Get all rms of a student
// @Description Retrieves all the rms of a student from the database.
// @Tags Rms
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RmsResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rms [get]
func (h *Handler) GetRmsBasic(c *gin.Context) {
	var rms []models.RmsResponse

	if err := h.DB.Table("rms").Where("usuari_id = ?", c.MustGet("user").(*models.Usuari).ID).Select("id, usuari_id, exercici_id, pes").Scan(&rms).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}
	if rms == nil {
		rms = []models.RmsResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rms})
}

// @Summary Upadate an rm
// @Description Updates a rm in the database.
// @Tags Rms
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the rm to update"
// @Param input body models.RmsInput true "Rm to update"
// @Success 200 {object} models.SuccessResponse{data=models.RmsResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rms/{id} [put]
func (h *Handler) UpdateRm(c *gin.Context) {
	var input models.RmsInput
	var user models.Usuari

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}
	if(input.ExerciciID == 0 || input.UsuariID == 0){
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "ExerciciID o UsuariID no poden ser 0"})
		return
	}

	if err := h.DB.Where("id = ?", input.UsuariID).Find(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	if user.ID != c.MustGet("user").(*models.Usuari).ID && (user.EntrenadorID == nil || *user.EntrenadorID != c.MustGet("user").(*models.Usuari).ID) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	oldRm := models.Rms{}
	newRm := models.Rms{UsuariID: input.UsuariID, ExerciciID: input.ExerciciID, Pes: input.Pes}

	if err := h.DB.Where("exercici_id = ? and usuari_id = ?", input.ExerciciID, user.ID).First(&oldRm).Error; err != nil {
		h.DB.Create(&newRm)
	} else {
		h.DB.Delete(&oldRm)
		h.DB.Create(&newRm)
	}

	var response models.RmsResponse
	if err := h.DB.Table("rms").Where("usuari_id = ? and exercici_id = ? and deleted_at is null", user.ID, input.ExerciciID).Select("id, usuari_id, exercici_id, pes").Scan(&response).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to retrieve rms"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: response})
}
