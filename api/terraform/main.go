package main

import (
	"log"
	"net/http"

	"opt/axentx/cloud-lab/api/terraform"
)

func main() {
	router := terraform.Router()

	const addr = ":8080"
	log.Printf("🚀 Starting Terraform API server on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}