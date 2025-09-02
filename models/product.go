package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Nombre             string             `bson:"nombre" json:"nombre" binding:"required"`
	Tipo               string             `bson:"tipo" json:"tipo" binding:"required"`
	UserID             primitive.ObjectID `bson:"user_id" json:"user_id"`
	FechaCreacion      time.Time          `bson:"fecha_creacion" json:"fecha_creacion"`
	FechaActualizacion time.Time          `bson:"fecha_ultima_actualizacion" json:"fecha_ultima_actualizacion"`
}

type CreateProductRequest struct {
	Nombre string `json:"nombre" binding:"required"`
	Tipo   string `json:"tipo" binding:"required"`
}

type UpdateProductRequest struct {
	Nombre string `json:"nombre"`
	Tipo   string `json:"tipo"`
}
