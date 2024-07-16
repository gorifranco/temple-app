package handlers

import (
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SolicitarUnio (cx *gin.Context) {
	var input models.SolicitudUnioInput
	if err := cx.ShouldBindJSON(&input); err != nil {
		cx.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	//Sala no existeix
	err := h.DB.Where("sala_id = ?", input.SalaID).First(models.Sala{}).Error
	if err != nil {
		cx.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	usuarisSala := models.UsuarisSala{SalaID: input.SalaID, UsuariID: GetUsuari(cx)}

	h.DB.Create(&input)

	c.JSON(200, gin.H{"data": "success"})
}