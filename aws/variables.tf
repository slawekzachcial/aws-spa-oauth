variable "aws_region" {
  default = "us-east-1"
}

variable "aws_profile" {
  default = "personal"
}

variable "oidc_issuer_base_url" {
  default = "https://localhost/auth/realms/master"
}

variable "oidc_issuer_thumbprint" {
  # To get thumbprint: openssl x509 -in ../keycloak/cert.pem -fingerprint -noout | sed -e 's/.*=//' -e 's/://g'
  type = string
}

variable "oidc_client_id" {
  # default = "aws-personal"
  default = "express-oauth-aws"
}

variable "tags" {
  default = {
    Project = "aws-spa-oauth"
  }
}
