require('dotenv').config()

const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const static = express.static(path.join(__dirname, 'public'))
app.use(static)

app.get('/oidc-config.js', (req, res) => {
    const spaOidcConfig = JSON.stringify({
        authority: process.env['ISSUER_BASE_URL'],
        client_id: process.env['SPA_CLIENT_ID'],
        redirect_uri: `${process.env['BASE_URL']}/callback.html`,
        post_logout_redirect_uri: `${process.env['BASE_URL']}/`,
        response_type: 'code',
        scope: "openid profile email"
    })
    const awsOidcConfig = JSON.stringify({
        authority: process.env['ISSUER_BASE_URL'],
        client_id: process.env['AWS_CLIENT_ID'],
        silent_redirect_uri: `${process.env['BASE_URL']}/callback-silent.html`,
        post_logout_redirect_uri: `${process.env['BASE_URL']}/`,
        response_type: 'code'
    })
    res.set('Content-Type', 'application/javascript')
    res.send(`spaOidcConfig = ${spaOidcConfig};\nawsOidcConfig = ${awsOidcConfig};`)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
