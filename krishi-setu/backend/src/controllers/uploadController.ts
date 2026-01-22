import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import path from 'path';

// Upload image
export const uploadImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Generate URL for the uploaded file
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || 'Error uploading file' });
    }
};
