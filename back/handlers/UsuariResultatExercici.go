package handlers

import (
	"net/http"
	"temple-app/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GuardarResultats(c *gin.Context) {
	var resultats []models.UsuariResultatExerciciInput

	if err := c.ShouldBindJSON(&resultats); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	type resp struct {
		EntrenadorID uint
		ID           uint
	}

	set := make(map[int]struct{})
	for _, resultat := range resultats {
		set[int(resultat.UsuariRutinaID)] = struct{}{}
	}

	ids := make([]int, 0, len(set))
	for id := range set {
		ids = append(ids, id)
	}

	var usuariIDs []resp

	query := `select u.entrenador_id as entrenador_id, u.id as id from Usuaris u inner join Usuari_rutina ur on u.id = ur.usuari_id
	 inner join usuari_resultat_exercici ure on ur.id = ure.usuari_rutina_id where ure.usuari_rutina_id IN (?)`

	if err := h.DB.Raw(query, ids).Scan(&usuariIDs).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, u := range usuariIDs {
		if u.ID != c.MustGet("id").(uint) && u.EntrenadorID != c.MustGet("id").(uint) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
	}

	tx := h.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for _, resultat := range resultats {
		if err := tx.Create(&models.UsuariResultatExercici{
			UsuariRutinaID:   resultat.UsuariRutinaID,
			ExerciciRutinaID: resultat.ExerciciRutinaID,
			Dia:              resultat.Dia,
			Repeticions:      resultat.Repeticions,
			Series:           resultat.Series,
			Pes:              resultat.Pes,
		}).Error; err != nil {
			tx.Rollback()
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resultat"})
			return
		}
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
