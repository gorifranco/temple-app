package models

type UsuarisSala struct {
	UsuariID uint   `gorm:"primaryKey"`
	SalaID   uint   `gorm:"primaryKey"`
}

func (UsuarisSala) TableName() string {
	return "usuari_sala"
}
