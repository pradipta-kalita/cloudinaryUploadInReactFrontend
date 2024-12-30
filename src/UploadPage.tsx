import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from '@/components/ui/label.tsx';
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

const UploadPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setImageUrl(null); // Reset the image URL until uploaded
        }
    };

    const cloudName = "dfths157i";
    const handleImageUpload = async () => {
        if (!image) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'demo_app'); // Replace with your Cloudinary upload preset

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            setIsUploading(false);
            setImageUrl(data.secure_url); // Set the uploaded image URL
            alert('Image uploaded successfully.');
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) {
            alert('Please upload an image before submitting.');
            return;
        }

        console.log('Form Data:', {
            name,
            email,
            imageUrl,
        });
    };

    return (
        <Card className="w-full max-w-lg mx-auto p-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Upload Your Image</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="mt-2"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="mt-2"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <Label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </Label>
                        <div className="mt-2 flex items-center space-x-4">
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image')?.click()}
                            >
                                Choose File
                            </Button>
                            {previewUrl && (
                                <div className="relative w-16 h-16 rounded overflow-hidden shadow-md">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            {previewUrl && (
                                <Button
                                    type="button"
                                    onClick={handleImageUpload}
                                    disabled={isUploading}
                                    className="ml-4"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!imageUrl}
                        className="w-full"
                    >
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default UploadPage;
