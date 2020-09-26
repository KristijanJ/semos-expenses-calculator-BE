const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const db = require('./pkg/db');
const config = require('./pkg/config');
const auth = require('./handlers');

db.init();

const api = express();

api.use(cors());
api.use(bodyParser.json());
api.use(
    jwt({
        secret: config.get('server').key,
        algorithms: ['HS256']
    }).unless({
        path: [
            { url: '/api/v1/auth/register', methods: ['POST'] },
            { url: '/api/v1/auth/login', methods: ['POST'] },
            // { url: '/api/v1/auth/get-user', methods: ['GET'] }
        ]
    })
);

api.post('/api/v1/auth/register', auth.register);
api.post('/api/v1/auth/login', auth.login);
api.get('/api/v1/auth/logout', auth.logout);
api.get('/api/v1/auth/refresh-token', auth.refresh);
api.get('/api/v1/auth/get-user', auth.getUser);

api.use(function (err, req, res, next) {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...')
    }
});

api.listen(config.get('server').port, err => {
    if (err) {
        return console.error(err);
    }
    console.log('App started on port ' + config.get('server').port);
});