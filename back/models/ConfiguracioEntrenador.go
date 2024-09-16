package models

import (
	"gorm.io/gorm"
)

type ConfiguracioEntrenador struct {
	gorm.Model
	EntrenadorID        uint   `gorm:"primaryKey"`
	Usuari              Usuari `gorm:"foreignKey:EntrenadorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	DuracioSessions     uint   `gorm:"not null;default:60"`
	MaxAlumnesPerSessio uint   `gorm:"not null;default:0"`
}

func (ConfiguracioEntrenador) TableName() string {
	return "configuracio_entrenador"
}

type ConfiguracioEntrenadorInput struct {
	DuracioSessions     uint `json:"duracioSessions"`
	MaxAlumnesPerSessio uint `json:"maxAlumnesPerSessio"`
}
