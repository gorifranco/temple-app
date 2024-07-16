package models

import (
	"gorm.io/gorm"
)

type Sala struct {
	gorm.Model
	Nom 			string 		`gorm:"not null;"`
	Admin 			Usuari		`gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func (Sala) TableName() string {
	return "sales"
}
