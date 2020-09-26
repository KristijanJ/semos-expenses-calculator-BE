const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const validate = require('../pkg/auth/validation');
const user = require('../pkg/auth/index')
const config = require('../pkg/config');

const register = (req, res) => {
    user.getUserByEmail(req.body.email)
        .then(u => {
            if (u !== null) {
                throw { message: 'Conflict', code: 409 };
            }
            req.body.password = bcrypt.hashSync(req.body.password);
            console.log(req.body);
            return user.createUser(req.body);
        })
        .then(u => {
            let payload = {
                uid: u._id,
                name: `${u.first_name} ${u.last_name}`,
                email: u.email,
                iat: parseInt(new Date().getTime()/1000),
                exp: parseInt((new Date().getTime() + (24 * 60 * 60 * 1000)) / 1000),
            };
            let token = jwt.sign(payload, config.get('server').key);
            res.status(201).send({msg: 'created', token: token});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Internal server error');
        });
};

const login = (req, res) => {
    validate.login(req.body)
        .then(matches => {
            if (!matches) {
                throw { message: 'Bad request', code: 400 };
            }
            return user.getUserByEmail(req.body.email);
        })
        .then(u => {
            console.log(u);
            if (u === null) {
                throw { message: 'Bad request', code: 400 };
            }
            if (!bcrypt.compareSync(req.body.password, u.password)) {
                throw { message: 'Bad request', code: 400 };
            }
            let payload = {
                uid: u._id,
                name: `${u.first_name} ${u.last_name}`,
                email: u.email,
                iat: parseInt(new Date().getTime()/1000),
                exp: parseInt((new Date().getTime() + (24 * 60 * 60 * 1000)) / 1000),
            };
            let token = jwt.sign(payload, config.get('server').key);
            res.status(200).send({token: token});
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

const logout = (req, res) => {
    res.status(200).send('ok');
};

const refresh = (req, res) => {
    let payload = {
        uid: req.user.uid,
        name: req.user.name,
        email: req.user.email,
        iat: parseInt(new Date().getTime() / 1000),
        exp: parseInt((new Date().getTime() + (24 * 60 * 60 * 1000)) / 1000), // (1 * 60 * 1000) токенот истекува по една минута - 60 секунди
    };
    let token = jwt.sign(payload, config.get('server').key);
    res.status(200).send({ token: token });
};

const getUser = (req, res) => {
    user.getUserByEmail(req.user.email)
        .then(u => {
            console.log(u);
            if (u === null) {
                throw { message: 'Bad request', code: 400 };
            }
            res.status(200).send(u);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

module.exports = {
    register,
    login,
    logout,
    refresh,
    getUser
};