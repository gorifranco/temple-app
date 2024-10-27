package models

type SuccessResponse struct {
	Data interface{} `json:"data"`
}

type ErrorResponse struct {
	Error interface{} `json:"error"`
}