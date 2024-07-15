package routes

import (
	"time"
	"temple-app/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"temple-app/handlers"
	"temple-app/middlewares/auth"
)

func Routing() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},                                                                                                                                                             // Métodos HTTP permitidos
		AllowHeaders:     []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Content-Disposition, Accept, Origin, Cache-Control, X-Requested-With, User-Agent, Accept-Language, Connection, Host, Referer, TE"}, // Encabezados permitidos
		ExposeHeaders:    []string{"Content-Length"},                                                                                                                                                                                               // Encabezados que los navegadores pueden acceder
		AllowCredentials: false,                                                                                                                                                                                                                    // Cambia a false si no estás utilizando credenciales
		MaxAge:           12 * time.Hour,                                                                                                                                                                                                           // Tiempo máximo que los resultados pueden ser cacheados
	}))

	db := database.GetDB()
	handler := handlers.NewHandler(db)

	usuaris := router.Group("/api/usuaris", auth.UserAuthMiddleware([]string{"Administrador"}))
	{
		usuaris.GET("", handlers.IndexUsuari)
		usuaris.GET("/:id", handlers.FindUsuari)
		usuaris.POST("", handlers.CreateUsuari)
		usuaris.PUT("/:id", handlers.UpdateUsuari)
		usuaris.DELETE("/:id", handlers.DeleteUsuari)
	}

	return router
}
