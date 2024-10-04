package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

type HorariResposta struct {
	ID          uint   `json:"ID"`
	DiaSetmana  int    `json:"DiaSetmana"`
	Desde       string `json:"Desde"`
	Fins        string `json:"Fins"`
}


func (h *Handler) FindConfiguracioEntrenador(c *gin.Context) {
	
	var configuracio models.ConfiguracioEntrenador
	var horaris []models.HorarisEntrenador
	var horariResposta []HorariResposta

	if c.MustGet("tipusUsuari").(string) == "Entrenador" {
		if err := h.DB.Where("entrenador_id = ?", c.MustGet("id").(uint)).First(&configuracio).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Configuració no trobada"})
			return
		}

		if err := h.DB.Where("entrenador_id = ?", c.MustGet("id").(uint)).Find(&horaris).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Horaris no trobats"})
			return
		}
		
		for _, h := range horaris {
			horariResposta = append(horariResposta, HorariResposta{
				ID:          h.ID,
				DiaSetmana:  h.DiaSetmana,
				Desde:       h.Desde.Format("15:04"),
				Fins:        h.Fins.Format("15:04"),
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"DuracioSessions":     configuracio.DuracioSessions,
				"MaxAlumnesPerSessio": configuracio.MaxAlumnesPerSessio,
				"Horaris":             horariResposta,
			},
		})
		return
	}
	var user models.Usuari
	if err := h.DB.Where("id = ?", c.MustGet("id").(uint)).First(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Where("entrenador_id = ?", user.EntrenadorID).First(&configuracio).Find(&horaris).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Where("entrenador_id = ?", user.EntrenadorID).Find(&horaris).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Horaris no trobats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"DuracioSessions":     configuracio.DuracioSessions,
			"MaxAlumnesPerSessio": configuracio.MaxAlumnesPerSessio,
			"Horaris":             horaris,
		},
	})
}

func (h *Handler) GuardarConfiguracioEntrenador(c *gin.Context) {
	var configuracio models.ConfiguracioEntrenadorInput
	var err error

	if err = c.ShouldBindJSON(&configuracio); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = h.DB.Model(&models.ConfiguracioEntrenador{}).Where("entrenador_id = ?", c.MustGet("id").(uint)).
		Updates(&models.ConfiguracioEntrenador{DuracioSessions: configuracio.DuracioSessions, MaxAlumnesPerSessio: configuracio.MaxAlumnesPerSessio}).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update configuracio entrenador"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
