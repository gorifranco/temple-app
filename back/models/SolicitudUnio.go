package models

import (
	"gorm.io/gorm"
)

type SolicitudUnio struct {
	gorm.Model
	UsuariID uint      `gorm:"primaryKey"`
	SalaID   uint      `gorm:"primaryKey"`
}

func (SolicitudUnio) TableName() string {
	return "solicituds_unio"
}

type SolicitudUnioInput struct {
	SalaID   uint `json:"sala_id"`
}