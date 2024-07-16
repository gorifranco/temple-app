package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexSala(c *gin.Context) {
	var sales []models.Sala
	h.DB.Find(&sales)

	c.JSON(http.StatusOK, gin.H{"data": sales})
}

func (h *Handler) FindSala(c *gin.Context) {
	var sala models.Sala

	if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sala})
}

func (h *Handler) CreateSala(c *gin.Context) {
	var input models.SalaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sala := models.Sala{Nom: input.Nom}

	h.DB.Create(&sala)

	var createdSala models.Usuari
	h.DB.First(&createdSala, sala.ID)

	c.JSON(http.StatusOK, gin.H{"data": createdSala})
}

func (h *Handler) UpdateSala(c *gin.Context) {
	var sala models.Sala
	if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var input models.UsuariInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedSala := models.Sala{Nom: input.Nom}

	h.DB.Model(&sala).Updates(&updatedSala)

	var uu models.Sala
	h.DB.Preload("TipusUsuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteSala(c *gin.Context) {
    var sala models.Sala
    if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
        return
    }

    h.DB.Delete(&sala)
    c.JSON(http.StatusOK, gin.H{"data": "success"})
}
