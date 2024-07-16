package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SolicitarUnio (cx *gin.Context) {
	var input models.SolicitudUnioInput
	if err := cx.ShouldBindJSON(&input); err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Sala no existeix
	err := h.DB.Where("sala_id = ?", input.SalaID).First(models.Sala{}).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Usuari ja està en la sala
	err = h.DB.Where("sala_id = ? AND usuari_id = ?", input.SalaID, auth.GetUsuari(cx)).First(models.UsuarisSala{}).Error
	if err == nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": `L'usuari ja està en la sala`})
		return
	}

	solicitud := models.SolicitudUnio{SalaID: input.SalaID, UsuariID: auth.GetUsuari(cx)}

	err = h.DB.Create(&solicitud).Error

	if err != nil {
		cx.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) AcceptarSolicitudUnio(cx *gin.Context) {

	var solicitud models.SolicitudUnio

	err := h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error

	//Solicitud existeix
	if(err != nil) {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return
	}

	//Usuari ja es troba dins el grup
	var usuariSala models.UsuarisSala
	err = h.DB.Where("usuari_id = ? and sala_id = ?", solicitud.UsuariID, solicitud.SalaID).First(&usuariSala).Error
	if(err == nil) {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "L'usuari ja es troba dins la sala"})
		return
	}

	//Inserir usuari en la sala
	usuariSala = models.UsuarisSala{UsuariID: solicitud.UsuariID, SalaID: solicitud.SalaID}
	h.DB.Create(&usuariSala)
	h.DB.Delete(&solicitud)

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) DeclinarSolicitudUnio(cx *gin.Context) {
	var solicitud models.SolicitudUnio

	err := h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return	
	}
	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}