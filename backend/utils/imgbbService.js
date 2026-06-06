const axios = require('axios');
const FormData = require('form-data');

const uploadToImgBB = async (imageBuffer) => {
    try {
        if (!process.env.IMGBB_API_KEY) {
            throw new Error('IMGBB_API_KEY is missing in .env');
        }

        const formData = new FormData();
        formData.append('image', imageBuffer.toString('base64'));

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        if (response.data && response.data.data && response.data.data.url) {
            return response.data.data.url;
        } else {
            throw new Error('Invalid response from ImgBB');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error.response?.data || error.message);
        throw new Error('Failed to upload image to ImgBB');
    }
};

module.exports = { uploadToImgBB };
