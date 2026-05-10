terraform {
  backend "local" {
    path = "config/terraform.tfstate"
  }
}