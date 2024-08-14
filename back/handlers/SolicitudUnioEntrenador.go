package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) SolicitudsEntrenador (cx *gin.Context) {
	var entrenador models.Usuari

	err := h.DB.Where("entrenador_id = ?", auth.GetUsuari(cx)).First(&entrenador).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cx.JSON(http.StatusOK, gin.H{"data": entrenador.SolicitudsUnioEntrenador})
}

func (h *Handler) SolicitarUnioEntrenador (cx *gin.Context) {
	var input models.SolicitudUnioEntrenadorInput
	var entrenador models.Usuari

	var err error
	if err = cx.ShouldBindJSON(&input); err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Entrenador no existeix
	err = h.DB.Where("codiEntrenador = ?", input.CodiEntrenador).First(&entrenador).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Usuari ja està en la sala
	var usuari models.Usuari
	h.DB.Where("ID = ?", auth.GetUsuari(cx)).First(usuari)

	if(usuari.EntrenadorID != nil){
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": `L'usuari ja té un entrenador`})
		return
	}

	solicitud := models.SolicitudUnioEntrenador{EntrenadorID: entrenador.ID, UsuariID: usuari.ID}

	err = h.DB.Create(&solicitud).Error

	if err != nil {
		cx.AbortWithStatusJSON(400, gin.H{"error": err.Error()})
		return
	}

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) AcceptarSolicitudUnioEntrenador(cx *gin.Context) {
	var entrenador models.Usuari
	var solicitud models.SolicitudUnioEntrenador
	var err error
	var usuari models.Usuari

	err = h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error

	//Solicitud existeix
	if(err != nil) {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return
	}

	err = h.DB.Where("ID = ?", solicitud.EntrenadorID).First(entrenador).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if(entrenador.ID != auth.GetUsuari(cx)){
		cx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return 
	}

	//Usuari ja es troba dins el grup
	for _, alumne := range entrenador.Alumnes {
		if alumne.ID == usuari.ID {
			cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "L'usuari ja es troba dins la sala"})
			return
		}
	}

	//Inserir usuari en la sala
	entrenador.Alumnes = append(entrenador.Alumnes, usuari)
	h.DB.Model(&entrenador).Update("alumnes", entrenador.Alumnes)
	h.DB.Delete(&solicitud)

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) DeclinarSolicitudUnioEntrenador(cx *gin.Context) {
	var solicitud models.SolicitudUnioEntrenador 
	var err error

	err = h.DB.Where("id = ?", cx.Param("solicitud_id")).First(&solicitud).Error
	if err != nil {
		cx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No existeix la solicitud"})
		return	
	}

	if(auth.GetUsuari(cx) != solicitud.EntrenadorID){
		cx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	err = h.DB.Delete(&solicitud).Error

	if err != nil {
		cx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete solicitud"})
		return
	}

	cx.JSON(http.StatusOK, gin.H{"data": "success"})
}