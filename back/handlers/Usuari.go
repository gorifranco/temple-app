package handlers

import (
	"net/http"
	"temple-app/models"
	"temple-app/services"

	"github.com/gin-gonic/gin"
)


// @Summary Get all users
// @Description Retrieves all the users from the database.
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.UsuariResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"	
// @Router /api/users [get]
func (h *Handler) IndexUsuari(c *gin.Context) {
	var usuaris []models.Usuari
	h.DB.Preload("TipusUsuari").Find(&usuaris)

	c.JSON(http.StatusOK, models.SuccessResponse{Data: usuaris})
}

// @Summary Get a user by ID
// @Description Retrieves a user from the database by its ID.
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "ID of the user to retrieve"
// @Success 200 {object} models.SuccessResponse{data=models.UsuariResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/users/{id} [get]
func (h *Handler) FindUsuari(c *gin.Context) {
	var usuari models.Usuari

	if err := h.DB.Preload("TipusUsuari").Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: usuari})
}


// @Summary Create a new user
// @Description Creates a new user in the database.
// @Tags Users
// @Accept json
// @Produce json
// @Param input body models.UsuariInput true "User to create"
// @Success 200 {object} models.SuccessResponse{data=models.UsuariResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/users [post]
func (h *Handler) CreateUsuari(c *gin.Context) {
	var input models.UsuariInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	hash, err := services.EncryptPassword(input.Password)
	if err != nil {		
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Error crypting password"})
		return
	}

	usuari := models.Usuari{Nom: input.Nom, Password: hash, TipusUsuariID: input.TipusUsuariID}

	if err = h.DB.Create(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create user"})
		return
	}

	var createdUsuari models.Usuari
	if err = h.DB.Preload("TipusUsuari").First(&createdUsuari, usuari.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to retrieve created user"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: createdUsuari})
}


// @Summary Update a user
// @Description Updates a user in the database.
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "ID of the user to update"
// @Param input body models.UsuariInput true "User to update"
// @Success 200 {object} models.SuccessResponse{data=models.UsuariResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/users/{id} [put]
func (h *Handler) UpdateUsuari(c *gin.Context) {
	var usuari models.Usuari
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	var input models.UsuariInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	hash := input.Password

	if hash != "" {
		hash, err = services.EncryptPassword(input.Password)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Error crypting password"})
			return
		}
	}

	updatedUsuari := models.Usuari{Nom: input.Nom, Password: hash, TipusUsuariID: input.TipusUsuariID}

	if err = h.DB.Model(&usuari).Updates(&updatedUsuari).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update user"})
		return
	}

	var uu models.Usuari
	if err = h.DB.Preload("TipusUsuari").First(&uu, c.Param("id")).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to retrieve updated user"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: uu})
}


// @Summary Delete a user
// @Description Deletes a user from the database.
// @Tags Users
// @Accept json
// @Produce json
// @Param id path int true "ID of the user to delete"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"	
// @Router /api/users/{id} [delete]
func (h *Handler) DeleteUsuari(c *gin.Context) {
    var usuari models.Usuari
    if err := h.DB.Where("id = ?", c.Param("id")).First(&usuari).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
        return
    }

    if err := h.DB.Delete(&usuari).Error; err != nil {
        c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete user"})
        return
    }

    c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}
