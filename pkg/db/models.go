package db

import (
	"gorm.io/gorm"
)

// Team represents a team in the database
type Team struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Members     []User `gorm:"many2many:team_members;"`
}

// UserMembership represents a user's membership in a team
type UserMembership struct {
	gorm.Model
	UserID uint `json:"user_id"`
	TeamID uint `json:"team_id"`
}

// User represents a user in the database
type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
	Teams    []Team `gorm:"many2many:team_members;"`
}