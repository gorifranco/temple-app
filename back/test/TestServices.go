package test

import (
	"github.com/gin-gonic/gin"
	"net/http/httptest"
)

func CreateTestContextWithID(id uint) *gin.Context {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	c.Set("id", id)

	return c
}
