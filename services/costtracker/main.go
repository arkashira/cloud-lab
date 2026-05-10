package main

import (
	"log"
	"time"

	"github.com/axentx/cloud-lab/services/costtracker/internal/costtracker"
)

func main() {
	ticker := time.NewTicker(5 * time.Minute)
	quit := make(chan struct{})

	go func() {
		for range ticker.C {
			costtracker.RefreshCostData()
			costtracker.CheckAndAlertThreshold()
		}
	}()

	<-quit
	ticker.Stop()
}