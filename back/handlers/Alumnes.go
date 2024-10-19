package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

type alumneResposta struct {
	ID                    uint                            `json:"ID"`
	Nom                   string                          `json:"Nom"`
	Alumnes               []models.Usuari                 `json:"Alumnes"`
	TipusUsuari           string                          `json:"TipusUsuari"`
	Reserves              []models.Reserva                `json:"Reserves"`
	RutinaActual          uint                            `json:"RutinaActual"`
	ResultatsRutinaActual []models.UsuariResultatExercici `json:"ResultatsRutinaActual"`
}

func (h *Handler) AlumnesEntrenador(c *gin.Context) {
	var alumnes []models.Usuari
	var err error

	if err = h.DB.Where("entrenador_id = ?", c.MustGet("id").(uint)).Preload("Alumnes").Preload("TipusUsuari").Preload("Reserves").Find(&alumnes).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	query := `select ure.id as id, ure.dia as dia, ure.repeticions as repeticions, ure.series as series, ure.pes as pes,
 ure.exercici_rutina_id as exercici_rutina_id from usuari_resultat_exercici ure
  inner join usuari_rutina ur on ur.id = ure.usuari_rutina_id where ur.data_finalitzacio is null and Usuari_id = 1;`

	var resposta []alumneResposta
	for _, alumne := range alumnes {
		var resultatsRutinaActual []models.UsuariResultatExercici
		var rutina models.UsuariRutina
		err = h.DB.Where("usuari_id = ? and data_finalitzacio is null", alumne.ID).First(&rutina).Error
		var tmp = alumneResposta{
			ID:          alumne.ID,
			Nom:         alumne.Nom,
			TipusUsuari: alumne.TipusUsuari.Nom,
			Reserves:    alumne.Reserves,
		}
		if err == nil {
			tmp.RutinaActual = rutina.RutinaID
		} else {
			tmp.RutinaActual = 0
		}

		if err := h.DB.Raw(query, alumne.ID).Scan(&resultatsRutinaActual).Error; err != nil {
			tmp.ResultatsRutinaActual = []models.UsuariResultatExercici{}
		} else {
			tmp.ResultatsRutinaActual = resultatsRutinaActual
		}

		resposta = append(resposta, tmp)
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

	if input.Nom == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Nom no pot ser buit"})
		return
	}

	usuariID := c.MustGet("id").(uint)
	usuari := models.Usuari{
		Nom:           input.Nom,
		EntrenadorID:  &usuariID,
		TipusUsuariID: 4,
	}

	if err = h.DB.Create(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": usuari})
}

func (h *Handler) UpdateUsuariFictici(c *gin.Context) {
	var usuari models.Usuari
	var err error

	var entrenador models.Usuari
	if err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error; err != nil {
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

func (h *Handler) ExpulsarUsuari(c *gin.Context) {
	var usuari models.Usuari
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var entrenador models.Usuari
	if err = h.DB.Where("id = ?", c.Copy().MustGet("id").(uint)).First(&entrenador).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if *usuari.EntrenadorID != entrenador.ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	usuari.EntrenadorID = nil
	h.DB.Save(&usuari)

	if usuari.TipusUsuari.Nom == "Fictici" {
		h.DB.Delete(&usuari)
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) FindAlumneEntrenador(c *gin.Context) {
	var alumne models.Usuari
	var err error
	var entrenador models.Usuari

	if err = h.DB.Where("id = ?", auth.GetUsuari(c)).First(&entrenador).Error; err != nil {
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

	var rutina models.UsuariRutina

	h.DB.Where("UsuariID = ? and data_finalitzacio is null", alumne.ID).First(&rutina)

	var resposta = alumneResposta{
		ID:           alumne.ID,
		Nom:          alumne.Nom,
		Reserves:     alumne.Reserves,
		RutinaActual: rutina.RutinaID,
	}

	c.JSON(http.StatusOK, gin.H{"data": resposta})
}
