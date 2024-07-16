package models

import (
	"gorm.io/gorm"
)

type Sala struct {
	gorm.Model
	Nom      string    `gorm:"not null;"`
	AdminID  uint      `gorm:"not null;"`
	Admin    Usuari    `gorm:"foreignKey:AdminID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Usuaris  []Usuari  `gorm:"many2many:usuari_sala;"`
	Reserves []Reserva `gorm:"many2many:reserves;"`
}

func (Sala) TableName() string {
	return "sales"
}

type SalaInput struct {
	Nom string `json:"nom"`
}

