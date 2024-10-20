package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"
	"temple-app/services"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

// @Description Data returned when logging in
// swagger:model UserResponse
type UserResponse struct {
	Nom            string `json:"nom"`
	Email          string `json:"email"`
	Token          string `json:"token"`
	TipusUsuari    string `json:"tipusUsuari"`
	CodiEntrenador string `json:"codiEntrenador"`
}

// @Description Data needed when creating a new user
// swagger:model usuariInput
type usuariInput struct {
	Nom           string `json:"nom" binding:"required"`
	Email         string `json:"email" binding:"required"`
	Password      string `json:"password" binding:"required"`
	TipusUsuariID int    `json:"tipusUsuariID" binding:"required"`
}

// @Description Data needed when logging in
// swagger:model Credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// @Summary Login
// @Description Logs in a user with email and password.
// @Tags Auth
// @Accept json
// @Produce json
// @Param input body Credentials true "Email and password"
// @Success 200 {object} models.SuccessResponse{data=UserResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/login [post]
func (h *Handler) Login(c *gin.Context) {
	var credentials Credentials
	var token string
	var err error

	if err = c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Bad request"})
		return
	}

	//Gets the user by email and password
	user, err := h.GetUserByEmailAndPassword(credentials.Email, credentials.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	//Generates the JWT token
	token, err = auth.GenerarToken(user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Couldn't generate token"})
		return
	}

	//Builds the response
	response := UserResponse{
		Nom:         user.Nom,
		Email:       user.Email,
		Token:       token,
		TipusUsuari: user.TipusUsuari.Nom,
	}
	//If the user is a trainer, add the trainer code
	if user.TipusUsuari.Nom == "Entrenador" {
		response.CodiEntrenador = user.CodiEntrenador
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: response})
}


// Gets the user by email and password
func (h *Handler) GetUserByEmailAndPassword(email string, password string) (*models.Usuari, error) {
	var user models.Usuari
	var err error

	//Checks if exists auser with given email
	if err = h.DB.Where("email = ?", email).Preload("TipusUsuari").First(&user).Error; err != nil || user.ID == 0 {
		return nil, err
	}

	// Checks if the password matches
	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, err // The password does not match
	}

	return &user, nil
}

// @Summary Register
// @Description Registers a new user in the database.
// @Tags Auth
// @Accept json
// @Produce json
// @Param input body models.UsuariInput true "User to register"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/register [post]
func (h *Handler) Registre(c *gin.Context) {
	var userInput usuariInput
	var err error

	if err = c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if h.UsuariExisteix(userInput.Email) {
		c.JSON(http.StatusConflict, models.ErrorResponse{Error: "User already exists"})
		return
	}
	if userInput.TipusUsuariID == 1 {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Cannot register an admin"})
		return
	}

	newUser := models.Usuari{Nom: userInput.Nom, Email: userInput.Email, Password: userInput.Password, TipusUsuariID: uint(userInput.TipusUsuariID)}

	//If user is a trainer, generate a unique code
	if userInput.TipusUsuariID == 3 {
		var codi string
		const maxAttempts = 100
		for attempts := 0; attempts < maxAttempts; attempts++ {
			codi = GenerateCode(7)
			var existingEntrenador models.Usuari
			if h.DB.Where("CodiEntrenador = ?", codi).First(&existingEntrenador).Error != nil {
				break
			}
			if attempts == maxAttempts-1 {
				c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to generate unique code"})
				return
			}
		}

		newUser.CodiEntrenador = codi
	}

	// Simulando una función que guardaría los datos del usuario en alguna parte
	if err = h.SaveUser(newUser); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	// Responder éxito si todo va bien
	c.JSON(http.StatusOK, models.SuccessResponse{Data: "User registered successfully"})
}

//Checks if user already exists
func (h *Handler) UsuariExisteix(email string) bool {
	var usuari models.Usuari
	var err error

	if err = h.DB.Where("email = ?", email).First(&usuari).Error; err != nil {
		return false
	}
	return true
}

//Saves the user in the database
func (h *Handler) SaveUser(usuari models.Usuari) error {
	var err error

	usuari.Password, err = services.EncryptPassword(usuari.Password)
	if err != nil {
		return err
	}

	// Crear el registro en la base de datos
	if err = h.DB.Create(&usuari).Error; err != nil {
		return err
	}
	return nil
}
