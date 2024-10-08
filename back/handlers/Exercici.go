package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexExercici(c *gin.Context) {
	var exercicis []models.Exercici
	h.DB.Find(&exercicis)

	c.JSON(http.StatusOK, gin.H{"data": exercicis})
}

func (h *Handler) FindExercici(c *gin.Context) {
	var exercici models.Exercici

	if err := h.DB.Where("id = ?", c.Param("id")).First(&exercici).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": exercici})
}

func (h *Handler) CreateExercici(c *gin.Context) {
	var input models.ExerciciInput
	var err error

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exercici := models.Exercici{Nom: input.Nom}

	if err = h.DB.Create(&exercici).Error; err != nil{
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exercici"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": exercici})

}