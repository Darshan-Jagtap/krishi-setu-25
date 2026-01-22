import { Request, Response } from 'express';
import { analyzeProductImage } from '../services/gemini';
import fs from 'fs';

export const analyzeImage = async (req: Request, res: Response) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        const imagePath = req.file.path;

        // Analyze the image
        const analysisResult = await analyzeProductImage(imagePath);

        // Clean up uploaded file
        fs.unlinkSync(imagePath);

        res.json({
            success: true,
            analysis: analysisResult
        });
    } catch (error: any) {
        console.error('Error in analyzeImage controller:', error);

        // Clean up file if it exists
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                // Ignore cleanup errors
            }
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to analyze image'
        });
    }
};
