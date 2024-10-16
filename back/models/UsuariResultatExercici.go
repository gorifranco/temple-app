package models

import (
	"time"

	"gorm.io/gorm"
)

type UsuariResultatExercici struct {
	gorm.Model
	UsuariRutinaID   uint      `gorm:"primaryKey"`
	ExerciciRutinaID uint      `gorm:"primaryKey"`
	Dia              time.Time `gorm:"primaryKey"`
	Repeticions      int       `gorm:"not null"`
	Series           int       `gorm:"not null"`
	Pes              float32   `gorm:"not null"`
}

func (UsuariResultatExercici) TableName() string {
	return "usuari_resultat_exercici"
}

type UsuariResultatExerciciInput struct {
	UsuariRutinaID   uint      `json:"usuariRutinaID"`
	ExerciciRutinaID uint      `json:"exerciciRutinaID"`
	Dia              time.Time `json:"dia"`
	Repeticions      int       `json:"repeticions"`
	Series           int       `json:"series"`
	Pes              float32   `json:"pes"`
}
