const products = require('../pkg/expense-calc');

// DONE
const getProducts = (req, res) => {
  products.getProducts(req.user.uid, req.query.filter)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
    });
};

// DONE
const getExpenses = (req, res) => {
  products.getExpenses(req.user.uid, req.query.year, req.query.month)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
    });
};

// DONE
const getProduct = (req, res) => {
  products.getProduct(req.params.id, req.user.uid)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
    });
};

// DONE
const addProduct = (req, res) => {
  let obj = {
    ...req.body,
    date: {
      full_date: req.body.date,
      day: req.body.date.split('-')[2],
      month: req.body.date.split('-')[1],
      year: req.body.date.split('-')[0]
    }
  }
  products.addProduct({...obj, owner_id: req.user.uid})
    .then(() => {
      res.status(201).send("created");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
    });
};

// DONE
const updateProduct = (req, res) => {
  console.log(req.body, req.params.id, req.user.uid);
  products.updateProduct(req.body, req.params.id, req.user.uid)
    .then(() => {
      res.status(204).send("no content");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
    });
};

// delete
const deleteProduct = (req, res) => {
  products.deleteProduct(req.params.id, req.user.uid)
    .then(() => {
      res.status(204).send("no content");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("internal server error");
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