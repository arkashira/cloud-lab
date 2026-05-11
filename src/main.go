package main

import (
	"github.com/gin-gonic/gin"
	"opt/axentx/cloud-lab/src/api"
)

func main() {
	r := gin.Default()
	api.RegisterAnsibleRoutes(r)
	r.Run(":8080")
}