package handlers

import (
	"net/http"
	"strconv"
	"temple-app/models"
	"time"

	"github.com/gin-gonic/gin"
)

// @Summary Save the results of a day of the current routine
// @Description Saves the results of a day of the current routine in the database.
// @Tags Exercises
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the routine to save the results of"
// @Param input body []models.UsuariResultatExerciciInput true "Results to save"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/guardarResultats [post]
func (h *Handler) GuardarResultats(c *gin.Context) {
	var resultats []models.UsuariResultatExerciciInput

	if err := c.ShouldBindJSON(&resultats); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	type resp struct {
		EntrenadorID uint
		ID           uint
	}

	//Creates a set to avoid duplicate IDs
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
		if u.ID != c.MustGet("id").(uint) && u.EntrenadorID != c.MustGet("user").(models.Usuari).ID {
			c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
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
			c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create resultat"})
			return
		}
	}

	tx.Commit()

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}

// @Summary Get the results of a day of the current routine
// @Description Retrieves the results of a day of the current routine from the database.
// @Tags Exercises
// @Security Bearer
// @Accept json
// @Produce json
// @Param mes path int true "mes"
// @Param any path int true "any"
// @Success 200 {object} models.SuccessResponse{data=[]models.UsuariResultatExerciciResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/entrenador/resultats/{mes}/{any} [get]
func (h *Handler) GetResultatsPerMes(c *gin.Context) {
	var resultats []models.UsuariResultatExerciciResponse
	var err error

	query := `select ure.usuari_rutina_id as usuari_rutina_id, ure.exercici_rutina_id as exercici_rutina_id, ure.dia as dia, ure.repeticions as repeticions, ure.series as series, ure.pes as pes,
 ure.exercici_rutina_id as exercici_rutina_id from usuari_resultat_exercici ure
  inner join usuari_rutina ur on ur.id = ure.usuari_rutina_id
  inner join usuaris u on u.id = ur.usuari_id
   where u.entrenador_id = ? and ure.dia >= ? AND ure.dia <= ?;`

   year, err := strconv.Atoi(c.Param("any"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}
   month, err := strconv.Atoi(c.Param("mes"))
   if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

   startDay := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)
   endDay := startDay.AddDate(0, 1, 0).Add(-time.Second)


	if err = h.DB.Raw(query, c.MustGet("user").(*models.Usuari).ID, startDay, endDay).Scan(&resultats).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if resultats == nil {
		resultats = []models.UsuariResultatExerciciResponse{}
	}
	c.JSON(http.StatusOK, models.SuccessResponse{Data: resultats})
}
