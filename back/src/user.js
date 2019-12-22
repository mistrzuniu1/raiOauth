const express = require('express');
const User = require('./models/User');
const auth = require('./middleware/auth');
const router = express.Router();
var Axios = require('axios')
var config = require('./config.json')


router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.loadByEmailPassword(email, password);
        if (!user) {
            return res.status(401).send()
        }
        const token = await user.generateAuthToken();
        res.send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }

});

router.post('/users/logingithub', async(req, res) => {
    try {
        const { acces_token } = req.body;
        await Axios.get('https://api.github.com/user',{
            headers: {
                Authorization: "token " + acces_token
            }
        }).then(async function (response) {
            console.log(response['data']['email'])
            const email = response['data']['email']
            const user = await User.loadByEmail(email);
            const token =  await user.generateAuthToken();

            res.send({user,token})
        })
    } catch (error) {
        res.status(400).send(error)
    }

});

router.post('/users/loginfacebook', async(req, res) => {
    try {
        console.log("trakakak");
        console.log(req.body['acces_token']);
        await Axios.get('https://graph.facebook.com/me?fields=email&access_token='.concat(req.body['acces_token'])).then(async function (response) {
            console.log(response)
            console.log(response['data']['email'])
            const email = response['data']['email']
            const user = await User.loadByEmail(email);
            const token =  await user.generateAuthToken();
            res.send({user,token})
        })
    } catch (error) {
        res.status(400).send(error)
    }

});


router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)
});

router.post('/users/me/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/users/me/stops', auth, async(req, res) => {
    res.send(req.user.stops)
});

router.post('/users/me/stop', auth, async(req, res) => {
    try {
        req.user.stops.push(req.body.stopName);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error)
    }
});


router.post('/auth/:provider', function(req, res){
    switch(req.params.provider) {
        case 'github':
            githubAuth(req, res)
            break
        case 'facebook':
            facebookAuth(req, res)
            break
    }
});

function githubAuth(req, res) {
    Axios.post('https://github.com/login/oauth/access_token', {
        client_id: config.auth.github.clientId,
        client_secret: config.auth.github.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri,
        state: req.body.state,
        grant_type: 'authorization_code'
    }, { 'Content-Type': 'application/json' }).then(function (response) {
        var responseJson = parseQueryString(response.data)
        if (responseJson.error) {
            res.status(500).json({ error: responseJson.error })
        } else {
            res.json(responseJson)
        }
    }).catch(function (err) {
        res.status(500).json(err)
    })
}

function facebookAuth(req, res) {
    Axios.post('https://graph.facebook.com/v2.4/oauth/access_token', {
        client_id: config.auth.facebook.clientId,
        client_secret: config.auth.facebook.clientSecret,
        code: req.body.code,
        redirect_uri: req.body.redirectUri
    }, { 'Content-Type': 'application/json' }).then(function (response) {
        var responseJson = response.data
        res.json(responseJson)
    }).catch(function (err) {
        res.status(500).json(err)
    })
}

function parseQueryString(str) {
    let obj = {};
    let key;
    let value;
    (str || '').split('&').forEach((keyValue) => {
        if (keyValue) {
            value = keyValue.split('=');
            key = decodeURIComponent(value[0]);
            obj[key] = (!!value[1]) ? decodeURIComponent(value[1]) : true;
        }
    });
    return obj;
}

module.exports = router;
