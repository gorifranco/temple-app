package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

type alumneResposta struct {
	ID          uint             `json:"ID"`
	Nom         string           `json:"Nom"`
	Alumnes     []models.Usuari  `json:"Alumnes"`
	TipusUsuari string           `json:"TipusUsuari"`
	Reserves    []models.Reserva `json:"Reserves"`
}

func (h *Handler) AlumnesEntrenador(c *gin.Context) {
	var alumnes []models.Usuari
	var err error

	if err = h.DB.Where("entrenador_id = ?", auth.GetUsuari(c)).Preload("Alumnes").Preload("TipusUsuari").Preload("Reserves").Find(&alumnes).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var resposta []alumneResposta
	for _, alumne := range alumnes {
		resposta = append(resposta, alumneResposta{
			ID:          alumne.ID,
			Nom:         alumne.Nom,
			Alumnes:     alumne.Alumnes,
			TipusUsuari: alumne.TipusUsuari.Nom,
			Reserves:    alumne.Reserves,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": resposta})
}

func (h *Handler) CrearUsuariFictici(c *gin.Context) {
	var input models.UsuariFicticiInput
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usuariID := auth.GetUsuari(c)
	usuari := models.Usuari{
		Nom:           input.Nom,
		EntrenadorID:  &usuariID,
		TipusUsuariID: 4,
	}

	err = h.DB.Create(&usuari).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": usuari})
}

func (h *Handler) UpdateUsuariFictici(c *gin.Context) {
	var usuari models.Usuari
	var err error

	var entrenador models.Usuari
	err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if usuari.EntrenadorID != &entrenador.ID || usuari.TipusUsuariID != 4 {
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

	updatedUsuari := models.Usuari{Nom: input.Nom}

	h.DB.Model(&usuari).Updates(&updatedUsuari)

	var uu models.Usuari
	h.DB.First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteUsuariFictici(c *gin.Context) {
	var usuari models.Usuari
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

	if usuari.EntrenadorID != &entrenador.ID || usuari.TipusUsuariID != 4 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	h.DB.Delete(&usuari)
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) FindAlumneEntrenador(c *gin.Context) {
	var alumne models.Usuari
	var err error
	var entrenador models.Usuari

	err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err = h.DB.Where("id = ?", c.Param("id")).First(&alumne).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if alumne.EntrenadorID == nil || *alumne.EntrenadorID != entrenador.ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var resposta = alumneResposta{
		ID:       alumne.ID,
		Nom:      alumne.Nom,
		Reserves: alumne.Reserves,
	}

	c.JSON(http.StatusOK, gin.H{"data": resposta})
}
