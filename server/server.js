const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const spotifyWebApi = require('spotify-web-api-node');
const loginInfo = require('../src/loginInfo.json');
const app = express()

app.use(cors())
app.use(bodyParser.json())


app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'htttp://localhost:3000',
        clientId: '376bc3106b9e4d1b87d6266c9662b517',
        clientSecret: 'f67341393f4640c8a69db7e283e2be37',
        refreshToken,
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
          res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn,
          })
        })
        .catch(err => {
          console.log(err)
          res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'htttp://localhost:3000',
        clientId: '376bc3106b9e4d1b87d6266c9662b517',
        clientSecret: 'f67341393f4640c8a69db7e283e2be37'
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001, () =>{
    console.log('listening on port 3001')
})