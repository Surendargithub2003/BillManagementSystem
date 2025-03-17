
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose
  .connect(
    'mongodb+srv://admin:123@bill-db.3b3qe.mongodb.net/surendar?retryWrites=true&w=majority&appName=bill-db'
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(cors());

app.use((req: any, res: any, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

const billSchema = mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
});

const Bill = mongoose.model('Bill', billSchema);

app.post('/api/products', (req:any, res:any) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
  });

  product.save().then((createdProduct: any) => {
    res.status(201).json({
      message: 'Product added successfully',
      productId: createdProduct._id,
    });
  });
});

app.get('/api/products', (req: any, res: any) => {
  Product.find().then((documents: any) => {
    res.status(200).json({
      message: 'Products fetched successfully!',
      products: documents,
    });
  });
});

app.put('/api/products/:id', (req: any, res: any) => {
  const product = new Product({
    _id: req.body._id,
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
  });

  Product.updateOne({ _id: req.params.id }, product).then(() => {
    res.status(200).json({ message: 'Update successful!' });
  });
});

app.delete('/api/products/:id', (req: any, res: any) => {
  Product.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: 'Product deleted!' });
  });
});

app.delete('/api/bills/:id', (req: any, res: any) => {
  Bill.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: 'Bill deleted!' });
  });
});

app.post('/api/bills', (req: any, res: any) => {
  const bill = new Bill({
    items: req.body.items,
  });

  bill.save().then((createdBill: any) => {
    Bill.findById(createdBill._id)
      .populate('items.product')
      .then((populatedBill: any) => {
        res.status(201).json({
          message: 'Bill saved successfully',
          billId: populatedBill._id,
          bill: populatedBill,
        });
      });
  });
});

app.get('/api/bills', (req: any, res: any) => {
  Bill.find()
    .populate('items.product')
    .then((documents: any) => {
      res.status(200).json({
        message: 'Bills fetched successfully!',
        bill: documents,
      });
    });
});

module.exports = app;
