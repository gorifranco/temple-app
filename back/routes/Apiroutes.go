package routes

import (
	"time"
	"temple-app/db"
	"temple-app/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"temple-app/auth"
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

	db := db.GetDB()
	handler := handlers.NewHandler(db)

	usuaris := router.Group("/api/usuaris", auth.UserAuthMiddleware([]string{"Administrador"}))
	{
		usuaris.GET("", handler.IndexUsuari)
		usuaris.GET("/:id", handler.FindUsuari)
		usuaris.POST("", handler.CreateUsuari)
		usuaris.PUT("/:id", handler.UpdateUsuari)
		usuaris.DELETE("/:id", handler.DeleteUsuari)
	}

	sales := router.Group("/api/sales", auth.UserAuthMiddleware([]string{"Basic"}))
	{
		sales.GET("", handler.IndexSala)
		sales.GET("/:id", handler.FindSala)
		sales.POST("", handler.CreateSala)
		sales.PUT("/:id", handler.UpdateSala)
		sales.DELETE("/:id", handler.DeleteSala)
	}
	router.GET("/api/salesUsuari", handler.SalesUsuari)

	router.POST("/api/login", handler.Login)
	router.POST("/api/register", handler.Registre)

	return router
}
