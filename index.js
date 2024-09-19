const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data'); 

const app = express();
const port = 5000;




const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);

      
        const response = await axios.post(
            `https://api.spoonacular.com/food/images/analyze?apiKey=${SPOONACULAR_API_KEY}`,
            form,
            { headers: { ...form.getHeaders() } }
        );

       
        console.log('Full Spoonacular API response:', response.data);

       
        let recipes = [];

        if (response.data.recipes && response.data.recipes.length > 0) {
            recipes = response.data.recipes.map(recipe => ({
                title: recipe.title,
                url: recipe.url
            }));
        }

      
        console.log('Extracted recipes:', recipes);

        res.json({ message: 'Image processed', recipes: recipes });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Failed to process image' });
    }
});






app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
