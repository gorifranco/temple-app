package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AlumnesEntrenador(c *gin.Context) {
	var entrenador models.Usuari
	var err error

	if err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if(entrenador.Alumnes == nil){
		c.JSON(http.StatusOK, gin.H{"data": []models.Usuari{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": entrenador.Alumnes})
}

func (h *Handler) CrearUsuariFictici(c *gin.Context) {
	var input models.UsuariFicticiInput
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usuariID := auth.GetUsuari(c)
	usuari := models.UsuariFictici{
		Nom:          input.Nom,
		EntrenadorID: &usuariID,
	}

	err = h.DB.Create(&usuari).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": usuari})
}

func (h *Handler) UpdateUsuariFictici(c *gin.Context) {
	var usuari models.UsuariFictici
	var err error

	var entrenador models.Usuari
	err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if(usuari.EntrenadorID != &entrenador.ID){
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var input models.UsuariFicticiInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedUsuari := models.UsuariFictici{Nom: input.Nom}

	h.DB.Model(&usuari).Updates(&updatedUsuari)

	var uu models.UsuariFictici
	h.DB.First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteUsuariFictici(c *gin.Context) {
	var usuari models.UsuariFictici
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var entrenador models.Usuari
	err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if(usuari.EntrenadorID != &entrenador.ID){
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	h.DB.Delete(&usuari)
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
