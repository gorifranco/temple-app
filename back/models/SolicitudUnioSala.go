package models

import (
	"gorm.io/gorm"
)

type SolicitudUnioSala struct {
	gorm.Model
	UsuariID uint      `gorm:"primaryKey"`
	SalaID   uint      `gorm:"primaryKey"`
}

func (SolicitudUnioSala) TableName() string {
	return "solicituds_unio_sala"
}

type SolicitudUnioSalaInput struct {
	SalaID   uint `json:"sala_id"`
}