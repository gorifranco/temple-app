package services

import (
	"log"
	"net/smtp"
	"os"
	"temple-app/models"

	"github.com/dgrijalva/jwt-go"
)

type emailClaims struct {
	Id    uint   `json:"id"`
	Email string `json:"email"`
	jwt.StandardClaims
}

var jwtKey = []byte(os.Getenv("API_TOKEN"))

func SendVerificationEmail(user *models.Usuari) {

	api_url := os.Getenv("API_URL")
	mail_user := os.Getenv("MAIL_USER")
	mail_pass := os.Getenv("MAIL_PASS")
	mail_host := os.Getenv("MAIL_HOST")
	mail_port := os.Getenv("MAIL_PORT")
	from := os.Getenv("MAIL_USER")
	to := []string{user.Email}

	token, err := CreateVerificationToken(user)
	if err != nil {
		log.Panic(err)
	}

	// Create the message
	msg := "Subject: discount Gophers!\r\n" +
	"Hello, this is a verification email for your Temple account. Please click the link below to verify your account:\n\n" +
	api_url + "/verificarEmail/" + token + "\n\n"

	// Send the email
	err = smtp.SendMail(mail_host+":"+mail_port, smtp.PlainAuth("", mail_user, mail_pass, mail_host), from, to, []byte(msg))
	if err != nil {
		log.Panic(err)
	}
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
