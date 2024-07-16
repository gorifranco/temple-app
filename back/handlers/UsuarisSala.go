package handlers

import (
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexUsuarisSala(c *gin.Context) {
	var usuarisSala []models.UsuarisSala

	err := h.DB.Where("sala_id = ?", c.Param("sala_id")).Find(&usuarisSala).Error
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"data": usuarisSala})
}

