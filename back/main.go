package main

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	_ "temple-app/docs"
	"temple-app/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"time"
)

func main() {

	//gin.DisableConsoleColor()
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		os.Exit(1)
	}
	logsPath := os.Getenv("LOGS_PATH")
	if logsPath == "" {
		log.Fatalf("LOGS_PATH environment variable is not set")
	}

	// Obtener el directorio del archivo
	dir := filepath.Dir(logsPath)

	// Crear el directorio si no existe
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		log.Fatalf("Error creating directory: %v", err)
	}

	// Crear el archivo
	f, err := os.Create(logsPath)
	if err != nil {
		log.Fatalf("Error creating log file: %v", err)
	}
	defer f.Close()

	//Custom logs output
	log.SetOutput(f)

	// Custom logs format
	log.SetFlags(log.Lshortfile | log.LstdFlags)

	gin.DefaultWriter = io.MultiWriter(f, os.Stdout) // For production mode delete os.Stdout

	router := routes.Routing()

	router.Use(gin.Recovery()) // Recovery middleware recovers from any panics and writes a 500 if there was one.

/* 	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
				param.ClientIP,
				param.TimeStamp.Format(time.RFC1123),
				param.Method,
				param.Path,
				param.Request.Proto,
				param.StatusCode,
				param.Latency,
				param.Request.UserAgent(),
				param.ErrorMessage,
		)
	}))
 */

	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %d %s %s\"\n",
				param.ClientIP,
				param.TimeStamp.Format(time.RFC1123),
				param.Method,
				param.Path,
				param.StatusCode,
				param.Latency,
				param.ErrorMessage,
		)
	}))

	router.Run(":" + os.Getenv("API_PORT"))
}
