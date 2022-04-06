variable "aws_region" {
  default = "us-east-1"
}

variable "aws_profile" {
  default = "personal"
}

variable "oidc_provider_url" {
  description = "Identity Provider URL; for Auth0 must trailing slash as that is the value in 'iss' in the token"
  type        = string
  # default = "https://localhost/auth/realms/master"
}

variable "oidc_provider_thumbprint" {
  # To get thumbprint: openssl x509 -in ../keycloak/cert.pem -fingerprint -noout | sed -e 's/.*=//' -e 's/://g'
  type = string

  # For Auth0 to get thumbprint: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
  default = "B3DD7606D2B5A8B4A13771DBECC9EE1CECAFA38A" # Auth0 intermediate CA cert
}

variable "oidc_client_id" {
  description = "Client ID"
  type        = string
  # default = "aws-personal"
  # default = "express-oauth-aws"
}

variable "tags" {
  default = {
    Project = "aws-spa-oauth"
  }
}
