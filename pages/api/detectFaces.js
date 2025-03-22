// filepath: pages/api/detectFaces.js
import { detectFaces } from '../../services/faceDetectionService';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'File upload failed' });
            }

            const imagePath = files.image.filepath;
            try {
                const result = await detectFaces(imagePath);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            } finally {
                fs.unlinkSync(imagePath); // Clean up uploaded file
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}