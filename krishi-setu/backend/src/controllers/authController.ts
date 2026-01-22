import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (userId: string, email: string, role: string) => {
    return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

// Register new user
export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, full_name, phone, location, role, fpo_registration_number, fpo_name, fpo_members_count, fpo_establishment_year } = req.body;

        // Validate required fields
        if (!email || !password || !full_name || !role) {
            return res.status(400).json({
                error: 'Please provide email, password, full name, and role'
            });
        }

        // Validate FPO-specific fields if role is FPO
        if (role === 'fpo') {
            if (!fpo_registration_number || !fpo_name) {
                return res.status(400).json({
                    error: 'FPO registration number and FPO name are required for FPO role'
                });
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Create new user with FPO fields if applicable
        const userData: any = {
            email,
            password,
            full_name,
            phone,
            location,
            role
        };

        // Add FPO-specific fields if role is FPO
        if (role === 'fpo') {
            userData.fpo_registration_number = fpo_registration_number;
            userData.fpo_name = fpo_name;
            if (fpo_members_count) userData.fpo_members_count = fpo_members_count;
            if (fpo_establishment_year) userData.fpo_establishment_year = fpo_establishment_year;
        }

        const user = await User.create(userData);

        // Generate token
        const token = generateToken(user._id.toString(), user.email, user.role);

        const userResponse: any = {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
        };

        // Add FPO-specific fields to response if role is FPO
        if (user.role === 'fpo') {
            userResponse.fpo_registration_number = user.fpo_registration_number;
            userResponse.fpo_name = user.fpo_name;
            userResponse.fpo_members_count = user.fpo_members_count;
            userResponse.fpo_establishment_year = user.fpo_establishment_year;
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse,
            token
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Error registering user' });
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.email, user.role);

        const userResponse: any = {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            phone: user.phone,
            location: user.location
        };

        // Add FPO-specific fields to response if role is FPO
        if (user.role === 'fpo') {
            userResponse.fpo_registration_number = user.fpo_registration_number;
            userResponse.fpo_name = user.fpo_name;
            userResponse.fpo_members_count = user.fpo_members_count;
            userResponse.fpo_establishment_year = user.fpo_establishment_year;
        }

        res.json({
            message: 'Login successful',
            user: userResponse,
            token
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message || 'Error logging in' });
    }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                phone: user.phone,
                location: user.location
            }
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        res.status(500).json({ error: error.message || 'Error fetching user' });
    }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { full_name, phone, location } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { full_name, phone, location },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                phone: user.phone,
                location: user.location
            }
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message || 'Error updating profile' });
    }
};
