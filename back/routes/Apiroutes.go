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
		solicituds.POST("/:id/aceptar", handler.AcceptarSolicitudUnioEntrenador)
		solicituds.POST("/:id/declinar", handler.DeclinarSolicitudUnioEntrenador)
	}

	entrenador := router.Group("/api/entrenador", auth.UserAuthMiddleware([]string{"Entrenador"}))
	{
		entrenador.GET("/alumnes", handler.AlumnesEntrenador)
		entrenador.GET("/alumnes/:id", handler.FindAlumneEntrenador)
		entrenador.POST("/usuarisFicticis", handler.CrearUsuariFictici)
		entrenador.PUT("/usuarisFicticis/:id", handler.UpdateUsuariFictici)
		entrenador.DELETE("/usuarisFicticis/:id", handler.DeleteUsuariFictici)
	}
	
	router.POST("/api/solicitarUnioEntrenador", handler.SolicitarUnioEntrenador, auth.UserAuthMiddleware([]string{}))

	exercicis := router.Group("/api/exercicis", auth.UserAuthMiddleware([]string{"Administrador"}))
	{
		exercicis.GET("/:id", handler.FindExercici)
		exercicis.POST("", handler.CreateExercici)
	}
	router.GET("/api/exercicis", handler.IndexExercici)

	rutines := router.Group("/api/rutines", auth.UserAuthMiddleware([]string{"Entrenador"}))
	{
		rutines.GET("", handler.IndexRutina)
		rutines.POST("", handler.CreateRutina)
		rutines.PUT("/:id", handler.UpdateRutina)
		rutines.DELETE("/:id", handler.DeleteRutina)
		rutines.POST("/exercicis/:rutinaId", handler.AfegirExercici)
		rutines.DELETE("/exercicis", handler.LlevarExercici)
		rutines.GET("/rutinesEntrenador", handler.RutinesEntrenador)
		rutines.GET("/rutinesPubliques", handler.RutinesPubliques)
		rutines.PUT("/:id/canviarVisibilitat", handler.CanviarVisibilitat)
	}

	router.POST("/api/login", handler.Login)
	router.POST("/api/register", handler.Registre)

	return router
}
