package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

// @Summary Get all exercicis
// @Description Retrieves all the exercicis from the database.
// @Tags Exercicis
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.ExerciciResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/exercicis [get]
// @Example 200 {object} models.SuccessResponse{data=[{"id": 10, "nom": "Extensión de tríceps en polea"}, {"id": 11, "nom": "Sentadilla"}]}
func (h *Handler) IndexExercici(c *gin.Context) {
	var exercicis []models.ExerciciResponse
	if err := h.DB.Table("exercicis").Select("id, nom").Where("deleted_at IS NULL").Scan(&exercicis).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: exercicis})
}

// @Summary Get an exercici by ID
// @Description Retrieves an exercici from the database by its ID.
// @Tags Exercicis
// @Accept json
// @Produce json
// @Param id path int true "ID of the exercici to retrieve"
// @Success 200 {object} models.SuccessResponse{data=models.ExerciciResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router			/api/exercicis/{id} [get]
func (h *Handler) FindExercici(c *gin.Context) {
	var exercici models.ExerciciResponse

	if err := h.DB.Table("exercicis").Select("id, nom").Where("id = ?", c.Param("id")).Scan(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: exercici})
}

// @Summary Create an exercici
// @Description Creates a new exercici in the database.
// @Tags Exercicis
// @Security Bearer
// @Accept json
// @Produce json
// @Param exercici body models.ExerciciInput true "Exercici to create"
// @Success 200 {object} models.SuccessResponse{data=models.ExerciciResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router			/api/exercicis [post]
func (h *Handler) CreateExercici(c *gin.Context) {
	var input models.ExerciciInput
	var err error

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if input.Nom == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Nom no pot ser buit"})
		return
	}

	if err := h.DB.Where("nom = ?", input.Nom).First(&models.Exercici{}).Error; err == nil {
		c.AbortWithStatusJSON(http.StatusConflict, models.ErrorResponse{Error: "Exercici ja existeix"})
		return
	}

	exercici := models.Exercici{Nom: input.Nom}

	if err = h.DB.Create(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create exercici"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: models.ExerciciResponse{ID: exercici.ID, Nom: exercici.Nom}})

}

// @Summary Delete an exercici
// @Description Deletes an exercici from the database.
// @Tags Exercicis
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the exercici to delete"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"	
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router			/api/exercicis/{id} [delete]
func (h *Handler) DeleteExercici(c *gin.Context) {
	var exercici models.Exercici
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if err = h.DB.Delete(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete exercici"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}
