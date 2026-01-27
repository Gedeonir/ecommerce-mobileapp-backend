const User = require('../models/User');
const express = require('express');
const jwt =  require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const {authorizeMiddleware,checkOwnership,authorizeSelfOrAdmin} = require('../middlewares/authorizeMiddleware');
const router = express.Router();
const parser = require('../utils/cloudinary');

// Define user-related routes here
router.post('/register',authMiddleware,authorizeMiddleware('admin'), async (req, res) => {
    try {
        const { name, email, password,telephone,role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            name, 
            email,
            telephone,
            password: hashedPassword,
            paymentMethods: [],
            accountConfirmationToken: generateRandomBytes(20).toString('hex'),
            role: role
        });
        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});


//get all users
router.get('/', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', authMiddleware, authorizeSelfOrAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:id', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authMiddleware, authorizeSelfOrAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:id/deactivate', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:id/activate', authMiddleware, authorizeMiddleware('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/update-profile', authMiddleware, checkOwnership, async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/change-profile-picture', authMiddleware, checkOwnership, parser.array('profile_picture'), async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.files) {
            return res.status(409).json({
                message:"You need to insert one or more files"
            })
        }
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        for (const file of req.files) {
            const { path } = file;
            findUser.profilePic = path;
        };

        await findUser.save();

        res.json({
            message:"Images added successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;