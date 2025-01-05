package services

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"temple-app/auth"
	"temple-app/db"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/dgrijalva/jwt-go"
)

type emailClaims struct {
	Id    uint   `json:"id"`
	Email string `json:"email"`
	jwt.StandardClaims
}

var jwtKey = []byte(os.Getenv("API_TOKEN"))

func SendVerificationEmail(user *models.Usuari) {

	fmt.Println("Send verification email reached")

	api_url := os.Getenv("API_URL")
	mail_user := os.Getenv("MAIL_USER")
	mail_pass := os.Getenv("MAIL_PASSWORD")
	mail_host := os.Getenv("MAIL_HOST")
	mail_port := os.Getenv("MAIL_PORT")
	from := os.Getenv("MAIL_USER")
	to := []string{user.Email}

	fmt.Printf("api_url: %s\n", api_url)
	fmt.Printf("mail_user: %s\n", mail_user)
	fmt.Printf("mail_pass: %s\n", mail_pass)
	fmt.Printf("mail_host: %s\n", mail_host)
	fmt.Printf("mail_port: %s\n", mail_port)
	fmt.Printf("from: %s\n", from)
	fmt.Printf("to: %s\n", to)

	token, err := CreateVerificationToken(user)
	if err != nil {
		log.Panic(err)
	}
	fmt.Printf("token created: %s\n", token)

	// Create the message
	msg := "From: " + from + "\r\n" +
		"To: " + strings.Join(to, ",") + "\r\n" +
		"Subject: Verificación de cuenta\r\n" +
		"Message-ID: <" + generateMessageID() + ">\r\n" +
		"\r\n" +
		"Hola, este es un correo de verificación para tu cuenta de Temple. Haz clic en el enlace siguiente para verificar tu cuenta:\n\n" +
		api_url + "/verificarEmail/" + token + "\n\n"

	fmt.Printf("msg created: %s\n", msg)

	// Send the email
	err = smtp.SendMail(mail_host+":"+mail_port, smtp.PlainAuth("", mail_user, mail_pass, mail_host), from, to, []byte(msg))
	if err != nil {
		fmt.Printf("Error sending email: %v\n", err)
		log.Panic(err)
	}

	fmt.Println("Email sent")
}

func CreateVerificationToken(user *models.Usuari) (string, error) {

	claims := &emailClaims{
		Id:             user.ID,
		StandardClaims: jwt.StandardClaims{},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, err
}

func VerifyEmailMiddleware(c *gin.Context) {
	tokenStr := c.Param("token")
	token, claims, err := auth.ParseToken(tokenStr)
	var user models.Usuari

	if !auth.TokenValid(c, token, err) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Token not valid"})
		return
	}

	if err = db.GetDB().Where("id = ?", claims.Id).First(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	c.Set("user", &user)
	c.Next()
}

func generateMessageID() string {
	return fmt.Sprintf("%d.%s@%s", time.Now().UnixNano(), "temple", "templeapp.com")
}
