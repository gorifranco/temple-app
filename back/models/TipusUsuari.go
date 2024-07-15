package models

import (
    "gorm.io/gorm"
)

// Festa representa una fiesta en la base de datos
type TipusUsuari struct {
    gorm.Model         
    Nom          string  `gorm:"not null;"`
}

func (TipusUsuari) TableName() string {
	return "tipusUsuaris"
}