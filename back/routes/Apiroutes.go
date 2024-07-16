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

/* 	reserves := router.Group("/api/reserves", auth.OwnerMiddleware())
	{
		reserves.GET("", handler.IndexReserva)
		reserves.GET("/:id", handler.FindReserva)
		reserves.POST("", handler.CreateReserva)
		reserves.PUT("/:id", handler.UpdateReserva)
		reserves.DELETE("/:id", handler.DeleteReserva)
	} */

	return router
}
