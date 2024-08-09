package handlers

import (
	"math/rand"
	"net/http"
	"temple-app/auth"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) IndexSala(c *gin.Context) {
	var sales []models.Sala
	h.DB.Find(&sales)

	c.JSON(http.StatusOK, gin.H{"data": sales})
}

func (h *Handler) FindSala(c *gin.Context) {
	var sala models.Sala

	if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sala})
}

func (h *Handler) CreateSala(c *gin.Context) {
	var input models.SalaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var codi string
	const maxAttempts = 100
	for attempts := 0; attempts < maxAttempts; attempts++ {
		codi = GenerateCode(7)
		var existingSala models.Sala
		if h.DB.Where("CodiSala = ?", codi).First(&existingSala).Error != nil {
			break
		}
		if attempts == maxAttempts-1 {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate unique code"})
			return
		}
	}

	sala := models.Sala{Nom: input.Nom, CodiSala: codi}

	if err := h.DB.Create(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create sala"})
		return
	}

	var createdSala models.Sala
	if err := h.DB.First(&createdSala, sala.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve created sala"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": createdSala})
}


func (h *Handler) UpdateSala(c *gin.Context) {
	var sala models.Sala
	if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var input models.UsuariInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedSala := models.Sala{Nom: input.Nom}

	h.DB.Model(&sala).Updates(&updatedSala)

	var uu models.Sala
	h.DB.Preload("TipusUsuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteSala(c *gin.Context) {
    var sala models.Sala
    if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
        return
    }

    h.DB.Delete(&sala)
    c.JSON(http.StatusOK, gin.H{"data": "success"})
}

func (h *Handler) SalesUsuari(c *gin.Context) {
	var usuari models.Usuari


	if err := h.DB.Where("id = ?", auth.GetUsuari(c)).Preload("Sales").Find(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": usuari.Sales})
}

func GenerateCode(n int) string {
	const lettersAndNumbers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	code := make([]byte, n)
	for i := range code {
		code[i] = lettersAndNumbers[r.Intn(len(lettersAndNumbers))]
	}

	return string(code)
}