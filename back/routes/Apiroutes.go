package routes

import (
	"temple-app/db"
	"temple-app/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"temple-app/auth"

	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
)

func Routing() *gin.Engine {
	router := gin.Default()

	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

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

	// sales := router.Group("/api/sales", auth.UserAuthMiddleware([]string{}))
	// {
	// 	sales.GET("", handler.IndexSala)
	// 	sales.GET("/:id", handler.FindSala)
	// 	sales.POST("", handler.CreateSala)
	// 	sales.PUT("/:id", handler.UpdateSala)
	// 	sales.DELETE("/:id", handler.DeleteSala)
	// 	sales.GET("/salesUsuari", handler.SalesUsuari)
	// 	sales.GET("/salesEntrenador", handler.SalesEntrenador)
	// }

	solicituds := router.Group("/api/solicituds", auth.UserAuthMiddleware([]string{"Entrenador"}))
	{
		solicituds.GET("/solicitudsEntrenador", handler.SolicitudsEntrenador)
		solicituds.PUT("/:id/aceptar", handler.AcceptarSolicitudUnioEntrenador)
		solicituds.POST("/:id/declinar", handler.DeclinarSolicitudUnioEntrenador)
	}

	router.POST("/api/reserves", auth.UserAuthMiddleware([]string{}), handler.CreateReserva)

	entrenador := router.Group("/api/entrenador", auth.UserAuthMiddleware([]string{"Entrenador"}))
	{
		entrenador.GET("/alumnes", handler.AlumnesEntrenador)
		entrenador.POST("/usuarisFicticis", handler.CrearUsuariFictici)
		entrenador.PUT("/usuarisFicticis/:id", handler.UpdateUsuariFictici)
		entrenador.PUT("/alumnes/:id/expulsar", handler.ExpulsarUsuari)
		entrenador.GET("/reserves", handler.ReservesEntrenador)
		entrenador.GET("/reserves/:mes/:year", handler.GetReservesEntrenadorPerMes)
		entrenador.POST("/assignarRutina", handler.AssignarRutina)
		entrenador.POST("/acabarRutina", handler.AcabarRutina)
		entrenador.POST("/guardarHorariEntrenador", handler.GuardarHorariEntrenador)
		entrenador.POST("/guardarConfiguracioEntrenador", handler.GuardarConfiguracioEntrenador)
		entrenador.GET("/solicitudsUnio", handler.SolicitudsEntrenador)
		entrenador.GET("/resultats/:mes/:any", handler.GetResultatsPerMes)
		entrenador.GET("/rms", handler.GetRmsEntrenador)
	}
	router.PUT("/api/rms", auth.UserAuthMiddleware([]string{}), handler.UpdateRm)
	router.POST("/api/solicitudUnioEntrenador", auth.UserAuthMiddleware([]string{}), handler.SolicitarUnioEntrenador)
	router.GET("/api/configuracioEntrenador", auth.UserAuthMiddleware([]string{}), handler.FindConfiguracioEntrenador)
	router.POST("api/guardarResultats", auth.UserAuthMiddleware([]string{}), handler.GuardarResultats)

	exercicis := router.Group("/api/exercicis", auth.UserAuthMiddleware([]string{"Administrador"}))
	{
		exercicis.POST("", handler.CreateExercici)
		exercicis.DELETE("/:id", handler.DeleteExercici)
	}
	router.GET("/api/exercicis", handler.IndexExercici)
	router.GET("/api/exercicis/:id", handler.FindExercici)

	rutines := router.Group("/api/rutines", auth.UserAuthMiddleware([]string{"Entrenador", "Administrador"}))
	{
		rutines.POST("", handler.CreateRutina)
		rutines.PUT("/:id", handler.UpdateRutina)
		rutines.DELETE("/:id", handler.DeleteRutina)
		rutines.POST("/exercicis/:rutinaId", handler.AfegirExercici)
		rutines.DELETE("/exercicis", handler.LlevarExercici)
		rutines.GET("/rutinesEntrenador", handler.RutinesEntrenador)
		rutines.GET("/rutinesPubliques", handler.RutinesPubliques)
		rutines.PUT("/:id/canviarVisibilitat", handler.CanviarVisibilitat)
	}

	//Rutes admin
	admin := router.Group("/api/admin", auth.UserAuthMiddleware([]string{"Administrador"}))
	{
		admin.GET("/rutines", handler.IndexRutina)
	}

	// Auth
	router.POST("/api/login", handler.Login)
	router.POST("/api/register", handler.Registre)

	return router
}
