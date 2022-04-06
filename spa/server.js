require('dotenv').config()

const express = require('express')
const path = require('path')
const axios = require('axios').default

const app = express()
const port = 3000

const static = express.static(path.join(__dirname, 'public'))
app.use(static)

app.get('/oidc-config.js', async (req, res) => {
    // This is a hack to make Logout work with Auth0 which does not provide end_session_endpoint property in its metadata
    const metadata = (await axios.get(`${process.env['OIDC_PROVIDER_URL']}.well-known/openid-configuration`)).data
    metadata.end_session_endpoint = `${process.env['OIDC_PROVIDER_URL']}v2/logout?returnTo=${encodeURIComponent(process.env['BASE_URL']+'/')}`

    const spaOidcConfig = JSON.stringify({
        authority: process.env['OIDC_PROVIDER_URL'],
        client_id: process.env['SPA_CLIENT_ID'],
        redirect_uri: `${process.env['BASE_URL']}/callback.html`,
        // post_logout_redirect_uri: `${process.env['BASE_URL']}/`,
        response_type: 'code',
        scope: "openid profile email",
        metadata: metadata
    })
    const awsOidcConfig = JSON.stringify({
        authority: process.env['OIDC_PROVIDER_URL'],
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
