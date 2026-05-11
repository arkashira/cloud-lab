package main

import (
	"github.com/labstack/echo/v4"
	"opt/axentx/cloud-lab/src/api"
)

func main() {
	e := echo.New()

	// Use the mock service for now; replace with real implementation as needed.
	svc := api.NewMockEksService()
	api.RegisterEksRoutes(e, svc)

	e.Start(":8080")
}