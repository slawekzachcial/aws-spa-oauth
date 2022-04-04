require('dotenv').config()

const express = require('express')
const { auth, requiresAuth } = require('express-openid-connect')

const app = express()
const port = 3000

app.use(
    auth({
        authRequired: false,
        idpLogout: true
    })
)

app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.send(`<p>Hello ${req.oidc.user.email}</p><a href="/logout">Logout</a>`)
    } else {
        res.send('<p>Hello stranger!</p><a href="/login">Login</a>')
    }
    // const loginLogoutSnippet = req.oidc.isAuthenticated()
    //     ? '<a href="/logout">Logout</a>'
    //     : '<a href="/login">Login</a>'
    // res.send(`<h1>Home</h1>${loginLogoutSnippet}<br><a href="/admin">Admin</a>`)
})

// app.get('/admin', requiresAuth(), (req, res) => {
//     res.send(`<h1>Admin</h1><a href="/">Home</a><br><a href="/logout">Logout</a><p>Hello ${req.oidc.user.email}</p>`)
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
