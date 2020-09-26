var mongoose = require('mongoose');

const Product = mongoose.model(
    'product',
    {
        name: String,
        description: String,
        type: String,
        date: Object,
        price: Number,
        owner_id: String
    },
    'products'
);

const getProducts = (uid, filter) => {
    if (filter === 'highest-price') {
        return Product.find({ owner_id: uid }).sort({ price: -1 }).exec();
    } else if (filter === 'lowest-price') {
        return Product.find({ owner_id: uid }).sort({ price: 1 }).exec();
    } else if (filter === 'latest-purchases') {
        return Product.find({ owner_id: uid }).sort({ date: -1 }).exec();
    } else {
        return Product.find({ owner_id: uid }).sort({ date: -1 }).exec();
    }
};

const getExpenses = (uid, year, month) => {
    if (month) {
        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        return Product.find({ owner_id: uid, "date.month": month, "date.year": year }).exec();
    } else {
        return Product.find({ owner_id: uid, "date.year": year }).exec();
    }
};

const getProduct = (id, uid) => {
    return new Promise((success, fail) => {
        Product.find({ _id: id, owner_id: uid }, (err, data) => {
            if (err) {
                return fail(err);
            }
            return success(data);
        })
    });
};

const addProduct = (data) => {
    return new Promise((success, fail) => {
        let product = new Product(data);
        product.save(err => {
            if(err) {
                return fail(err);
            }
            return success();
        });
    })
};

// CHECK
const updateProduct = (data, id, uid) => {
    return new Promise((success, fail) => {
        Product.updateOne({ _id: id, owner_id: uid }, data, err => {
            if (err) {
                return fail(err);
            }
            return success();
        });
    });
};

const deleteProduct = (id, uid) => {
    return new Promise((success, fail) => {
        Product.deleteOne({ _id: id, owner_id: uid }, err => {
            if(err) {
                return fail(err);
            }
            return success();
        });
    });
};

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    getExpenses
};