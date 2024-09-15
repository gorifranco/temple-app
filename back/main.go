package main

import (
    "temple-app/routes"
    "github.com/gin-gonic/gin"
    "os"
    "io"
)

func main() {

    gin.DisableConsoleColor()
    f, _ := os.Create("/var/log//temple/backend.log")
    gin.DefaultWriter = io.MultiWriter(f)

    router := routes.Routing()

    router.Run(":8080")
}
