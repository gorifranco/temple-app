package main

import (
    "temple-app/routes"
)

func main() {

    router := routes.Routing()

    router.Run(":8080")
}
