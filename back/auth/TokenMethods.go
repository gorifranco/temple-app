package auth

import (
	"net/http"
	"strings"
	"temple-app/models"
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte("gfnicolawpass")

type Claims struct {
	Id          uint   `json:"id"`
	Email       string `json:"email"`
	TipusUsuari string `json:"tipusUsuari"`
	jwt.StandardClaims
}

func GenerarToken(user *models.Usuari) (string, error) {
	claims := &Claims{
		Id:          user.ID,
		TipusUsuari: user.TipusUsuari.Nom,
		StandardClaims: jwt.StandardClaims{},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, err
}

func UserAuthMiddleware(tipusAdmesos []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := c.GetHeader("Authorization")
		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

		// Extraer y validar el token
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
        if err != nil {
            if err.(*jwt.ValidationError).Errors == jwt.ValidationErrorExpired {
                c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token_expired", "message": "The authentication token has expired. Please log in again."})
                return
            }
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token", "message": "Invalid token"})
            return
        }

        if !token.Valid {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token", "message": "Invalid token"})
            return
        }

        // Validar el tipo de usuario
        if !contains(tipusAdmesos, claims.TipusUsuari) {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "access_denied", "message": "Access denied for user type"})
            return
        }

		c.Next()
	}
}

func GetUsuari(c *gin.Context) uint {
	claims := &Claims{}

	tokenStr := c.GetHeader("Authorization")
	tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")
	jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	fmt.Println(claims)

	return claims.Id
}

func contains(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}