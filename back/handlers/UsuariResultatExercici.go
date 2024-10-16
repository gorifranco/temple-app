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

	query := `select u.entrenador_id as entrenador_id, u.id as id from Usuaris u inner join Usuari_rutina ur on u.id = ur.usuari_id
	 inner join usuari_resultat_exercici ure on ur.id = ure.usuari_rutina_id where ure.usuari_rutina_id = ?`

	type resp struct {
		EntrenadorID uint
		ID           uint
	}

	var u resp

	for _, resultat := range resultats {
		if err := h.DB.Raw(query, resultat.UsuariRutinaID).Scan(&u).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if u.ID != c.MustGet("id").(uint) && u.EntrenadorID != c.MustGet("id").(uint) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
	}

	for _, resultat := range resultats {
		if err := h.DB.Create(&models.UsuariResultatExercici{
			UsuariRutinaID:   resultat.UsuariRutinaID,
			ExerciciRutinaID: resultat.ExerciciRutinaID,
			Dia:              resultat.Dia,
			Repeticions:      resultat.Repeticions,
			Series:           resultat.Series,
			Pes:              resultat.Pes,
		}).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resultat"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}
