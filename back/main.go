package main

import (
	_ "temple-app/docs"
	"temple-app/routes"
	// "github.com/gin-gonic/gin"
	// "os"
	// "io"
)

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
func main() {

	// gin.DisableConsoleColor()
	// f, _ := os.Create("/var/log//temple/backend.log")
	// gin.DefaultWriter = io.MultiWriter(f)

	router := routes.Routing()

	router.Run(":8080")
}
