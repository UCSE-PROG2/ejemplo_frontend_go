package routes

import (
	"ejemplo_web/handlers"
	"ejemplo_web/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Rutas públicas
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{
			"Title": "App",
		})
	})
	r.GET("/login", func(c *gin.Context) {
		c.HTML(200, "login.html", gin.H{
			"Title": "Iniciar Sesión",
		})
	})
	r.GET("/register", func(c *gin.Context) {
		c.HTML(200, "register.html", gin.H{
			"Title": "Registro",
		})
	})
	r.GET("/products", func(c *gin.Context) {
		c.HTML(200, "products.html", gin.H{
			"Title": "Productos",
		})
	})

	// API pública
	api := r.Group("/api")
	{
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)
	}

	// API privada (requiere autenticación)
	apiPrivate := r.Group("/api")
	apiPrivate.Use(middleware.AuthMiddleware())
	{
		apiPrivate.GET("/products", handlers.GetProducts)
		apiPrivate.POST("/products", handlers.CreateProduct)
		apiPrivate.PUT("/products/:id", handlers.UpdateProduct)
		apiPrivate.DELETE("/products/:id", handlers.DeleteProduct)
	}
}
