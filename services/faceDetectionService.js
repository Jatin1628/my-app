// filepath: services/faceDetectionService.js
const { spawn } = require('child_process');
const path = require('path');

const detectFaces = (imagePath) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [
            path.join(__dirname, '../face_detection.py'),
            imagePath,
        ]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(JSON.parse(result));
            } else {
                reject(new Error('Face detection failed'));
            }
        });
    });
};

module.exports = { detectFaces };