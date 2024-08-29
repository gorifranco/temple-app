package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (h *Handler) IndexRutina(c *gin.Context) {
	var rutinas []models.Rutina
	h.DB.Find(&rutinas)

	c.JSON(http.StatusOK, gin.H{"data": rutinas})
}

func (h *Handler) CreateRutina(c *gin.Context) {
	var input models.RutinaInput
	var err error
	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio, EntrenadorID: c.MustGet("id").(uint), Cicles: input.Cicles}

	h.DB.Transaction(func(tx *gorm.DB) error {
		err = h.DB.Create(&rutina).Error

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create rutina"})
			return err
		}

		exercicis := input.Exercicis

		for _, exercici := range exercicis {
			exercici.RutinaID = rutina.ID
			err = h.DB.Create(&exercici).Error
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exercici"})
				return err
			}
		}
		return nil
	})

	var createdRutina models.Rutina
	h.DB.First(&createdRutina, rutina.ID).Preload("Exercicis")

	c.JSON(http.StatusOK, gin.H{"data": createdRutina})
}

func (h Handler) UpdateRutina(c *gin.Context) {
	var rutina models.Rutina
	if err := h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
	}

	var input models.RutinaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedRutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio}

	h.DB.Model(&rutina).Updates(&updatedRutina)

	var uu models.Rutina
	h.DB.Preload("Exercicis").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteRutina(c *gin.Context) {
	var rutina models.Rutina
	if err := h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	h.DB.Delete(&rutina)
	c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) RutinesEntrenador(c *gin.Context) {
	var rutines []models.Rutina

	h.DB.Find(&rutines).Where("entrenador_id = ?", auth.GetUsuari(c)).Preload("Exercicis")

	c.JSON(http.StatusOK, gin.H{"data": rutines})
}

func (h *Handler) RutinesPubliques(c *gin.Context) {
	var rutines []models.Rutina

	h.DB.Find(&rutines).Where("publica = ?", true).Preload("Exercicis")

	c.JSON(http.StatusOK, gin.H{"data": rutines})
}

func (h *Handler) CanviarVisibilitat(c *gin.Context) {
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	if rutina.EntrenadorID != auth.GetUsuari(c) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	rutina.Publica = !rutina.Publica

	err = h.DB.Model(&rutina).Update("publica", rutina.Publica).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update rutina"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}
