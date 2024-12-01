package models

import (
	"gorm.io/gorm"
)

type Rms struct {
	gorm.Model
	UsuariID   uint `gorm:"primaryKey"`
	Usuari     Usuari
	ExerciciID uint `gorm:"primaryKey"`
	Exercici   Exercici
	Pes        uint `gorm:"not null"`
}

func (Rms) TableName() string {
	return "rms"
}

type RmsInput struct {
	UsuariID   uint `json:"usuariID"`
	ExerciciID uint `json:"exerciciID"`
	Pes        uint `json:"pes"`
}

type RmsResponse struct {
	ID         uint `json:"id"`
	UsuariID   uint `json:"usuariID"`
	ExerciciID uint `json:"exerciciID"`
	Pes        uint `json:"pes"`
}
