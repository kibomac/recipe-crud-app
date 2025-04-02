import express from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
import {
    getRecipes,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe,
} from './database.js';

dotenv.config();

// Log environment values
console.log('Environment Variables:');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '******' : 'Not Set'}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`PORT: ${process.env.PORT || 3600}`);

const app = express();
const PORT = process.env.PORT || 3600;

// Set up middleware
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./src/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Custom method override middleware
app.use((req, res, next) => {
    if (req.body && req.body._method) {
        console.log(`Original Method: ${req.method}, Overridden Method: ${req.body._method.toUpperCase()}`);
        req.method = req.body._method.toUpperCase(); // Override the HTTP method
        delete req.body._method; // Remove _method from the body to avoid conflicts
    }
    next();
});

// Routes
app.get('/', async (req, res) => {
    const recipes = await getRecipes();
    res.render('index', { recipes });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/recipes', async (req, res) => {
    const { name, description, ingredients, instructions } = req.body;
    await addRecipe(name, description, ingredients, instructions);
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const recipe = await getRecipeById(req.params.id);
    res.render('edit', { recipe });
});

app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await getRecipeById(req.params.id);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        res.render('view', { recipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/recipes/:id', async (req, res) => {
    const { name, description, ingredients, instructions } = req.body;
    try {
        await updateRecipe(req.params.id, name, description, ingredients, instructions);
        res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/recipes/:id', async (req, res) => {
    await deleteRecipe(req.params.id);
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});