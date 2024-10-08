package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexUsuarisSala(c *gin.Context) {
	var usuarisSala []models.UsuarisSala

	if err := h.DB.Where("sala_id = ?", c.Param("sala_id")).Find(&usuarisSala).Error; err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": usuarisSala})
}

func (h *Handler) ExpulsarUsuariSala(c *gin.Context) {
	var usuarisSala models.UsuarisSala
	var err error

	if err = h.DB.Where("usuari_id = ? and sala_id = ?", c.Param("usuari_id"), c.Param("sala_id")).First(&usuarisSala).Error; err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": `l'usuari no es troba dins la sala`})
		return
	}

	if err = h.DB.Delete(&usuarisSala).Error; err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": `No s'ha pogut expulsar a l'usuari`})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
