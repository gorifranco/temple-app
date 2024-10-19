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
// @Success 200 {object} []models.ExerciciResponse
// @Failure 500 {object} string
// @Router			/api/exercicis [get]
// @Example 200 {object} []models.ExerciciResponse{ "data": [{"id": 10, "nom": "Extensión de tríceps en polea"}, {"id": 11, "nom": "Sentadilla"}] }
func (h *Handler) IndexExercici(c *gin.Context) {
	var exercicis []models.ExerciciResponse
	if err := h.DB.Table("exercicis").Select("id, nom").Scan(&exercicis).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": exercicis})
}

// @Summary Get an exercici by ID
// @Description Retrieves an exercici from the database by its ID.
// @Tags Exercicis
// @Accept json
// @Produce json
// @Param id path int true "ID of the exercici to retrieve"
// @Success 200 {object} models.ExerciciResponse
// @Failure 500 {object} string
// @Router			/api/exercicis/{id} [get]
// @Example 200 {object} models.Exercici{ "data": {"id": 10, "nom": "Extensión de tríceps en polea"} }
func (h *Handler) FindExercici(c *gin.Context) {
	var exercici models.ExerciciResponse

	if err := h.DB.Table("exercicis").Select("id, nom").Where("id = ?", c.Param("id")).Scan(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": exercici})
}

// @Summary Create an exercici
// @Description Creates a new exercici in the database.
// @Tags Exercicis
// @Security Bearer
// @Security Admin
// @Accept json
// @Produce json
// @Param exercici body models.ExerciciInput true "Exercici to create"
// @Success 200 {object} models.ExerciciResponse
// @Failure 400 {object} string
// @Failure 401 {object} string
// @Failure 409 {object} string
// @Failure 500 {object} string
// @Router			/api/exercicis [post]
func (h *Handler) CreateExercici(c *gin.Context) {
	var input models.ExerciciInput
	var err error

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Nom == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Nom no pot ser buit"})
		return
	}

	if err := h.DB.Where("nom = ?", input.Nom).First(&models.Exercici{}).Error; err == nil {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "Exercici ja existeix"})
		return
	}

	exercici := models.Exercici{Nom: input.Nom}

	if err = h.DB.Create(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exercici"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": models.ExerciciResponse{ID: exercici.ID, Nom: exercici.Nom}})

}

// @Summary Delete an exercici
// @Description Deletes an exercici from the database.
// @Tags Exercicis
// @Security Bearer
// @Security Admin
// @Accept json
// @Produce json
// @Param id path int true "ID of the exercici to delete"
// @Success 200 {object} string
// @Failure 401 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Router			/api/exercicis/{id} [delete]
func (h *Handler) DeleteExercici(c *gin.Context) {
	var exercici models.Exercici
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	if err = h.DB.Delete(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete exercici"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
