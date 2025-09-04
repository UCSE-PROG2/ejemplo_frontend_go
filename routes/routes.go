package routes

import (
	"ejemplo_web/handlers"
	"ejemplo_web/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// Public HTML pages
	r.GET("/", handlers.IndexPage)
	r.GET("/login", handlers.LoginPage)
	r.GET("/register", handlers.RegisterPage)
	r.GET("/products", handlers.ProductsPage)

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
