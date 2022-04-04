require('dotenv').config()

const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const static = express.static(path.join(__dirname, 'public'))
app.use(static)

app.get('/oidc-config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript')
    res.send(`oidcConfig = ${JSON.stringify({
        authority: process.env['ISSUER_BASE_URL'],
        client_id: process.env['CLIENT_ID'],
        redirect_uri: `${process.env['BASE_URL']}/callback.html`,
        response_type: 'code'
    })}`)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
