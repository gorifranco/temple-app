package models

import (
	"gorm.io/gorm"
	"time"
)

type Reserva struct {
	gorm.Model
	UsuariID 		uint		`gorm:"not null;"`
	Usuari 			Usuari		`gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Hora 			time.Time	`gorm:"not null;"`
}

func (Reserva) TableName() string {
	return "reserves"
}

type ReservaInput struct {
	Hora 			time.Time 	`json:"hora"`
}