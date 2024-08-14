package models

import (
	"gorm.io/gorm"
)

type SolicitudUnioEntrenador struct {
	gorm.Model
	UsuariID     uint `gorm:"primaryKey"`
	EntrenadorID uint `gorm:"primaryKey"`
}

func (SolicitudUnioEntrenador) TableName() string {
	return "solicituds_unio_entrenador"
}

type SolicitudUnioEntrenadorInput struct {
	CodiEntrenador string `json:"codiEntrenador"`
}
