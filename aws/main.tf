provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

resource "aws_iam_openid_connect_provider" "this" {
  url  = var.oidc_provider_url
  tags = var.tags

  client_id_list = [
    var.oidc_client_id
  ]

  thumbprint_list = [
    lower(var.oidc_provider_thumbprint)
  ]
}

resource "aws_iam_role" "this" {
  name = "aws_spa_oauth"
  tags = var.tags

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : {
        "Effect" : "Allow",
        "Principal" : { "Federated" : aws_iam_openid_connect_provider.this.arn },
        "Action" : "sts:AssumeRoleWithWebIdentity",
        "Condition" : {
          "StringEquals" : {
            "${replace(var.oidc_provider_url, "https://", "")}:aud" : var.oidc_client_id
          }
        }
      }
    }
  )

  inline_policy {
    name = "aws_spa_oauth"

    policy = jsonencode(
      {
        "Version" : "2012-10-17",
        "Statement" : [
          {
            "Effect" : "Allow",
            "Action" : [
              "sts:GetCallerIdentity"
            ],
            "Resource" : "*"
          }
        ]
      }
    )
  }
}
