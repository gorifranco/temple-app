package models

import (
	"gorm.io/gorm"
)

// Festa representa una fiesta en la base de datos
type UsuariFictici struct {
	gorm.Model
	Nom                      string
	Reserves                 []Reserva   `gorm:"many2many:reserves;"`
	EntrenadorID             *uint                     `gorm:"index"`
	Entrenador               *Usuari                   `gorm:"foreignKey:EntrenadorID"`
}

func (UsuariFictici) TableName() string {
	return "usuarisFicticis"
}

type UsuariFicticiInput struct {
	Nom           string `json:"nom"`
}