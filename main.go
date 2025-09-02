package main

import (
	"log"

	"ejemplo_web/database"
	"ejemplo_web/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conectar a MongoDB
	if err := database.Connect(); err != nil {
		log.Fatal("Error conectando a MongoDB:", err)
	}
	defer database.Disconnect()

	// Configurar Gin
	r := gin.Default()

	// Cargar templates HTML
	r.LoadHTMLGlob("templates/*")

	// Servir archivos estáticos
	r.Static("/static", "./static")

	// Configurar rutas
	routes.SetupRoutes(r)

	// Iniciar servidor
	log.Println("Servidor iniciado en http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Error iniciando servidor:", err)
	}
}
