package models

import (
	"gorm.io/gorm"
)

type UsuarisSala struct {
	gorm.Model
	Usuari []Usuari `gorm:"many2many:usuari_sala;"`
	Sala   Sala     `gorm:"not null;"`
}
