package auth

import (
	"net/http"
	"strconv"
	"strings"
	"temple-app/models"

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
		Id:             user.ID,
		TipusUsuari:    user.TipusUsuari.Nom,
		StandardClaims: jwt.StandardClaims{},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	return tokenString, err
}

func UserAuthMiddleware(tipusAdmesos []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := ExtractToken(c)

		token, claims, err := ParseToken(tokenStr)
		if !TokenValid(c, token, err) {
			return
		}

		if len(tipusAdmesos) == 0 {
			c.Set("id", GetUsuari(c))
			c.Set("tipusUsuari", claims.TipusUsuari)
			c.Next()
			return
		}

		if !UserTypeValid(c, claims, tipusAdmesos) {
			return
		}

		c.Set("id", GetUsuari(c))
		c.Set("tipusUsuari", claims.TipusUsuari)
		c.Next()
	}
}

func OwnerAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := ExtractToken(c)

		token, claims, err := ParseToken(tokenStr)
		if !TokenValid(c, token, err) {
			return
		}
		if claims.TipusUsuari == "Administrador" {
			c.Next()
		}

		i, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return
		}
		if claims.Id == uint(i) {
			c.Next()
		}

		c.Next()
	}
}

func ExtractToken(c *gin.Context) string {
	tokenStr := c.GetHeader("Authorization")
	return strings.TrimPrefix(tokenStr, "Bearer ")
}

// ParseToken analiza y valida el token JWT
func ParseToken(tokenStr string) (*jwt.Token, *Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	return token, claims, err
}

// TokenValid verifica si el token es válido y maneja errores
func TokenValid(c *gin.Context, token *jwt.Token, err error) bool {
	if err != nil {
		if err.(*jwt.ValidationError).Errors == jwt.ValidationErrorExpired {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token_expired", "message": "The authentication token has expired. Please log in again."})
			return false
		}
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token", "message": "Invalid token"})
		return false
	}

	if !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token", "message": "Invalid token"})
		return false
	}

	return true
}

// UserTypeValid verifica si el tipo de usuario es válido
func UserTypeValid(c *gin.Context, claims *Claims, tipusAdmesos []string) bool {
	if !contains(tipusAdmesos, claims.TipusUsuari) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "access_denied", "message": "Access denied for user type"})
		return false
	}
	return true
}

func GetUsuari(c *gin.Context) uint {
	claims := &Claims{}

	tokenStr := c.GetHeader("Authorization")
	tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")
	jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

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
