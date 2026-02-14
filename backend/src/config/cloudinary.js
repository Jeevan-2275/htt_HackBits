const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath, folder = 'htt_hackbits/videos') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video', // 'auto' behaves weirdly sometimes with audio
            folder: folder
        });
        return result;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

module.exports = { cloudinary, uploadToCloudinary };
