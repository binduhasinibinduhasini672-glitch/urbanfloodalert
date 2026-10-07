const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const supabase = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation Schemas
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        if (!supabase) return res.status(500).json({ error: 'Database not connected' });

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        // PGRST116 means no rows found, which is expected here
        if (checkError && checkError.code !== 'PGRST116') {
            return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ name, email, password_hash }])
            .select()
            .single();

        if (error) throw error;

        // Note: Generally login is required after registration, 
        // or we return a JWT here too, based on preference. 
        // We will just return success.
        res.status(201).json({
            message: 'Registration successful',
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        if (!supabase) return res.status(500).json({ error: 'Database not connected' });

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
    try {
        if (!supabase) return res.status(500).json({ error: 'Database not connected' });

        // req.user comes from the authenticateToken middleware
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Never return password_hash
        const { password_hash, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
