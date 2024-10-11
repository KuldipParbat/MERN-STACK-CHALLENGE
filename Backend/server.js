const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://kartik:kartik123@cluster07.vclwx.mongodb.net/transactionsDB')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a transaction schema
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String,
});


const Transaction = mongoose.model('Transaction', transactionSchema);

// API to seed the database
app.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Convert dateOfSale to Date object if needed
    transactions.forEach(tx => {
      tx.dateOfSale = new Date(tx.dateOfSale); // Ensure date is a Date object
    });

    await Transaction.deleteMany(); // Clear previous data
    await Transaction.insertMany(transactions);

    res.send('Database initialized with seed data');
  } catch (err) {
    res.status(500).send('Error initializing database');
  }
});

// API to list all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find(); // Fetch all transactions from the collection
    res.json(transactions); // Send the transactions as JSON response
  } catch (err) {
    res.status(500).send('Error fetching transactions');
  }
});

// API for statistics
app.get('/statistics', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth(), 1);
  const endDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth() + 1, 0);

  const statistics = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$price' },
        totalSold: { $sum: { $cond: ['$sold', 1, 0] } },
        totalNotSold: { $sum: { $cond: ['$sold', 0, 1] } }
      }
    }
  ]);

  res.json(statistics[0]);
});

// API for bar chart (price range breakdown)
app.get('/barchart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth(), 1);
  const endDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth() + 1, 0);

  const priceRanges = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
        default: 'Above 900',
        output: { count: { $sum: 1 } }
      }
    }
  ]);

  res.json(priceRanges);
});

// API for pie chart (category breakdown)
app.get('/piechart', async (req, res) => {
  const { month } = req.query;

  const startDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth(), 1);
  const endDate = new Date(new Date().getFullYear(), new Date(Date.parse(month + " 1")).getMonth() + 1, 0);

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.json(categories);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
