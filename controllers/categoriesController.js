const Category = require('../models/Category');
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { authorizeMiddleware } = require('../middlewares/authorizeMiddleware');
const router = express.Router();

// Create a new category
router.post('/', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a category
router.put('/:id', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updates = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updates, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a category
router.delete('/:id', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;