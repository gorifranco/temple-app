package handlers

import (
	"net/http"
	"temple-app/auth"
	"temple-app/models"
	"temple-app/services"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserResponse struct {
	Nom         string `json:"nom"`
	Email       string `json:"email"`
	Token       string `json:"token"`
	TipusUsuari string `json:"tipusUsuari"`
}

type usuariInput struct {
	Nom           string `json:"nom" binding:"required"`
	Email         string `json:"email" binding:"required"`
	Password      string `json:"password" binding:"required"`
	TipusUsuariID int    `json:"tipusUsuariID" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var token string

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	user, err := h.GetUserByEmailAndPassword(credentials.Email, credentials.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	token, err = auth.GenerarToken(user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Couldn't generate token"})
		return
	}

	response := UserResponse{
		Nom:         user.Nom,
		Email:       user.Email,
		Token:       token,
		TipusUsuari: user.TipusUsuari.Nom,
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": response})
}

func (h *Handler) GetUserByEmailAndPassword(email string, password string) (*models.Usuari, error) {
	var user models.Usuari
	result := h.DB.Where("email = ?", email).Preload("TipusUsuari").First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	// Verificando la contraseña
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, err // La contraseña no coincide
	}

	return &user, nil
}

func (h *Handler) Registre(c *gin.Context) {
	var userInput usuariInput

	if err := c.ShouldBindJSON(&userInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	if h.UsuariExisteix(userInput.Email) {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}
	if userInput.TipusUsuariID == 1 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot register an admin"})
		return
	}

	newUser := models.Usuari{Nom: userInput.Nom, Email: userInput.Email, Password: userInput.Password, TipusUsuariID: uint(userInput.TipusUsuariID)}

	if(userInput.TipusUsuariID == 3){
		var codi string
		const maxAttempts = 100
		for attempts := 0; attempts < maxAttempts; attempts++ {
			codi = GenerateCode(7)
			var existingEntrenador models.Usuari
			if h.DB.Where("CodiEntrenador = ?", codi).First(&existingEntrenador).Error != nil {
				break
			}
			if attempts == maxAttempts-1 {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate unique code"})
				return
			}
		}

		newUser.CodiEntrenador = codi
	}

	// Simulando una función que guardaría los datos del usuario en alguna parte
	if err := h.SaveUser(newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not register user", "details": err.Error()})
		return
	}

	// Responder éxito si todo va bien
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func (h *Handler) UsuariExisteix(email string) bool {
	var usuari models.Usuari
	result := h.DB.Where("email = ?", email).First(&usuari)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false
		}
		return false
	}
	return true
}

func (h *Handler) SaveUser(usuari models.Usuari) error {
	var err error

	usuari.Password, err = services.EncryptPassword(usuari.Password)
	if err != nil {
		return err
	}

	// Crear el registro en la base de datos
	result := h.DB.Create(&usuari)
	if result.Error != nil {
		return result.Error
	}

	return nil
}
