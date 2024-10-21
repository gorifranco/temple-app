
package handlers

import (
	"math/rand"
	"net/http"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)


// @Summary Get all salas
// @Description Retrieves all the salas from the database.
// @Tags Sales
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.Sala}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/sales [get]
func (h *Handler) IndexSala(c *gin.Context) {
	var sales []models.Sala
	h.DB.Find(&sales)

	c.JSON(http.StatusOK, models.SuccessResponse{Data: sales})
}


// @Summary Get a sala
// @Description Retrieves a sala from the database by its ID.
// @Tags Sales
// @Accept json
// @Produce json
// @Param id path int true "ID of the sala to retrieve"
// @Success 200 {object} models.SuccessResponse{data=models.Sala}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/sales/{id} [get]
func (h *Handler) FindSala(c *gin.Context) {
	var sala models.Sala

	if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: sala})
}


// @Summary Create a new sala		
// @Description Creates a new sala in the database.
// @Tags Sales
// @Accept json
// @Produce json
// @Param input body models.SalaInput true "Sala to create"
// @Success 200 {object} models.SuccessResponse{data=models.Sala}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"	
// @Router /api/sales [post]
func (h *Handler) CreateSala(c *gin.Context) {
	var input models.SalaInput
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
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
			c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate unique code"})
			return
		}
	}

	sala := models.Sala{Nom: input.Nom, CodiSala: codi, AdminID: c.MustGet("user").(models.Usuari).ID}

	if err = h.DB.Create(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create sala"})
		return
	}

	var createdSala models.Sala
	if err = h.DB.First(&createdSala, sala.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to retrieve created sala"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: createdSala})
}


// @Summary Update a sala
// @Description Updates a sala in the database.
// @Tags Sales
// @Accept json
// @Produce json
// @Param id path int true "ID of the sala to update"
// @Param input body models.SalaInput true "Sala to update"
// @Success 200 {object} models.SuccessResponse{data=models.Sala}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/sales/{id} [put]
func (h *Handler) UpdateSala(c *gin.Context) {
	var sala models.Sala
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	var input models.UsuariInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	updatedSala := models.Sala{Nom: input.Nom}

	if err = h.DB.Model(&sala).Updates(&updatedSala).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update sala"})
		return
	}

	var uu models.Sala
	h.DB.Preload("TipusUsuari").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, models.SuccessResponse{Data: uu})
}


// @Summary Delete a sala
// @Description Deletes a sala from the database.
// @Tags Sales
// @Accept json
// @Produce json
// @Param id path int true "ID of the sala to delete"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/sales/{id} [delete]
func (h *Handler) DeleteSala(c *gin.Context) {
    var sala models.Sala
    if err := h.DB.Where("id = ?", c.Param("id")).First(&sala).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
        return
    }

    if err := h.DB.Delete(&sala).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete sala"})
        return
    }

    c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}


// @Summary Get all sales of an entrenador
// @Description Retrieves all the sales of an entrenador from the database.
// @Tags Sales
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.Sala}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/sales/salesUsuari [get]
func (h *Handler) SalesEntrenador(c *gin.Context) {
	var sales []models.Sala

	h.DB.Find(&sales).Where("admin_id = ?", c.MustGet("user").(models.Usuari).ID).Preload("Usuaris").Preload("Reservas")

	c.JSON(http.StatusOK, models.SuccessResponse{Data: sales})
}


// Generates a unique code of the given length
func GenerateCode(n int) string {
	const lettersAndNumbers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	code := make([]byte, n)
	for i := range code {
		code[i] = lettersAndNumbers[r.Intn(len(lettersAndNumbers))]
	}

	return string(code)
}
