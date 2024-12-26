const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://samarthkasma21:admin@cluster0.iml4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// POST routes to create stores and categories
app.post('/store', async (req, res) => {
    const { name, location } = req.body;
    try {
        const newStore = new Store({ name, location });
        await newStore.save();
        res.status(200).json({ message: 'Store added successfully', store: newStore });
    } catch (error) {
        res.status(500).json({ message: 'Error adding store', error });
    }
});

app.post('/category', async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(200).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
