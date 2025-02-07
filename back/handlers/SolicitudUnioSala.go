package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SolicitarUnio(cx *gin.Context) {
	var input models.SolicitudUnioSalaInput
	var err error

	if err = cx.ShouldBindJSON(&input); err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Sala no existeix
	if err = h.DB.Where("sala_id = ?", input.SalaID).First(&models.Sala{}).Error; err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Usuari ja està en la sala
	if err = h.DB.Where("sala_id = ? AND usuari_id = ?", input.SalaID, auth.GetUsuari(cx)).First(models.UsuarisSala{}).Error; err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": `L'usuari ja està en la sala`})
		return
	}

	solicitud := models.SolicitudUnioSala{SalaID: input.SalaID, UsuariID: cx.MustGet("user").(models.Usuari).ID}

	if err = h.DB.Create(&solicitud).Error; err != nil {
		cx.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) AcceptarSolicitudUnio(cx *gin.Context) {
	var solicitud models.SolicitudUnioSala
	var err error

	if err = h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error; err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return
	}

	//Usuari ja es troba dins el grup
	var usuariSala models.UsuarisSala
	if err = h.DB.Where("usuari_id = ? and sala_id = ?", solicitud.UsuariID, solicitud.SalaID).First(&usuariSala).Error; err != nil {
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
	var solicitud models.SolicitudUnioSala

	if err := h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error; err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return
	}
	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}
