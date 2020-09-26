const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const db = require('./pkg/db')
const config = require('./pkg/config');
const products = require('./handlers');

db.init();

const api = express();

api.use(cors());
api.use(bodyParser.json());
api.use(
    jwt({
        secret: config.get('server').key,
        algorithms: ['HS256']
    })
);

api.get('/api/v1/products', products.getProducts); // done
api.post('/api/v1/products', products.addProduct); // done
api.get('/api/v1/products/:id', products.getProduct); // done
api.put('/api/v1/products/:id', products.updateProduct); // done
api.delete('/api/v1/products/:id', products.deleteProduct); // done
api.get('/api/v1/expenses', products.getExpenses); // done

api.use(function (err, req, res, next) {
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