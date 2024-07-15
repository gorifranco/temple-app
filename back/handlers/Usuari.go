package handlers

import (
	"net/http"
	"temple-app/models"
	"temple-app/services"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexUsuari(c *gin.Context) {
	var usuaris []models.Usuari
	h.DB.Preload("TipusUsuari").Find(&usuaris)

	c.JSON(http.StatusOK, gin.H{"data": usuaris})
}

func (h *Handler) FindUsuari(c *gin.Context) {
	var usuari models.Usuari

	if err := h.DB.Preload("TipusUsuari").Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": usuari})
}

func (h *Handler) CreateUsuari(c *gin.Context) {
	var input models.UsuariInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := services.EncryptPassword(input.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error crypting password"})
		return
	}

	usuari := models.Usuari{Nom: input.Nom, Telefon: input.Telefon, Password: hash}

	h.DB.Create(&usuari)

	var createdUsuari models.Usuari
	h.DB.Preload("TipusUsuari").First(&createdUsuari, usuari.ID)

	c.JSON(http.StatusOK, gin.H{"data": createdUsuari})
}

func (h *Handler) UpdateUsuari(c *gin.Context) {
	var usuari models.Usuari
	if err := h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var input models.UsuariInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash := input.Password
	var err error

	if hash != "" {
		hash, err = services.EncryptPassword(input.Password) // nota que aquí usamos = en lugar de :=
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error crypting password"})
			return
		}
	}

	updatedUsuari := models.Usuari{Nom: input.Nom, Telefon: input.Telefon, Password: hash}

	h.DB.Model(&usuari).Updates(&updatedUsuari)

	var uu models.Usuari
	h.DB.Preload("TipusUsuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteUsuari(c *gin.Context) {
    var usuari models.Usuari
    if err := h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
        return
    }

    h.DB.Delete(&usuari)
    c.JSON(http.StatusOK, gin.H{"data": "success"})
}
