module "sandbox" {
  source = file("./common/tags.tf")

  providers = {
    aws = aws
  }
}