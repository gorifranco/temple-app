package models

import (
	"gorm.io/gorm"
	"time"
)

type Reserva struct {
	gorm.Model
	UsuariID uint      `gorm:"primaryKey"`
	SalaID   uint      `gorm:"primaryKey"`
	Hora     time.Time `gorm:"primaryKey"`
}

func (Reserva) TableName() string {
	return "reserves"
}

type ReservaInput struct {
	Hora time.Time `json:"hora"`
}
