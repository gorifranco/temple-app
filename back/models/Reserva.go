package models

import (
	"gorm.io/gorm"
	"time"
)

type Reserva struct {
	gorm.Model
	UsuariID     uint      `gorm:"primaryKey"`
	Hora         time.Time `gorm:"primaryKey"`
	Confirmada   bool
	EntrenadorID uint      `gorm:"not null"`
}

func (Reserva) TableName() string {
	return "reserves"
}

type ReservaInput struct {
	Hora   time.Time `json:"hora"`
	UsuariID *uint      `json:"usuariID"`
}
