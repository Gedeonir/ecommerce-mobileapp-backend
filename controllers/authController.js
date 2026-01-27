const User=require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const html = require('../utils/confirmMsg');

const generateToken = (user, expiry) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: expiry || '1d' });
}

const generateRandomBytes = (size) => {
    return require('crypto').randomBytes(size);
}


router.post('/register', async (req, res) => {
    try {
        const { name, email, password,telephone } = req.body;
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
            accountConfirmationToken: generateRandomBytes(20).toString('hex')
        });
        await newUser.save();
        
        if (newUser) {
            const message = `Thank you for registering with Market Nest. We're excited to have you on board! Please verify your email to get started.`;
            
            await sendEmail({
                email: newUser.email,
                subject: 'Welcome to Market Nest',
                message,
                html:html(hashedToken,process.env.FRONTEND_URL)    
            });
        }
        res.status(201).json({message: 'User registered successfully'});
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email to login' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been deactivated. Please contact support Team.' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOneAndUpdate({ accountConfirmationToken: token }, { isVerified: true });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }
        const token = generateRandomBytes(20).toString('hex');
        user.accountConfirmationToken = token;
        await user.save();
        const message = `Please verify your email to get started.`;
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message,
            html:html(token)
        });
        res.json({ message: 'Verification email resent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = generateRandomBytes(20).toString('hex');
        user.passwordResetToken = token;
        await user.save();
        const message = `Please click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message,
            html:html(token)
        });
        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}); 

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ passwordResetToken: token }, { password: hashedPassword });
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;