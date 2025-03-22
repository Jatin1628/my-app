// filepath: components/FaceDetectionForm.tsx
import React, { useState } from 'react';

const FaceDetectionForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [faces, setFaces] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch('/api/detectFaces', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        setFaces(data.faces || []);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Detect Faces</button>
            </form>
            {faces.length > 0 && (
                <div>
                    <h3>Detected Faces:</h3>
                    <ul>
                        {faces.map((face, index) => (
                            <li key={index}>
                                x: {face.x}, y: {face.y}, width: {face.width}, height: {face.height}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FaceDetectionForm;