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

// Home Page - List all recipes
app.get('/', async (req, res) => {
    try {
        const recipes = await getRecipes();
        res.render('index', { recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add Recipe Page
app.get('/add', (req, res) => {
    res.render('add');
});

// Add Recipe - Handle form submission
app.post('/recipes', async (req, res) => {
    const { name, description, ingredients, instructions } = req.body;
    try {
        await addRecipe(name, description, ingredients, instructions);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Edit Recipe Page
app.get('/edit/:id', async (req, res) => {
    try {
        console.log('Fetching recipe for edit with ID:', req.params.id); // Debugging log
        const recipeArray = await getRecipeById(req.params.id);
        console.log('Recipe fetched for edit:', recipeArray); // Debugging log

        // Extract the first element of the array
        const recipe = recipeArray[0];
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        res.render('edit', { recipe }); // Pass the recipe object to the view
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

// View Recipe Page
app.get('/recipes/:id', async (req, res) => {
    try {
        console.log('Fetching recipe with ID(app.js):', req.params.id); // Debugging log
        const recipeArray = await getRecipeById(req.params.id);
        console.log('Recipe fetched:', recipeArray); // Debugging log

        // Extract the first element of the array
        const recipe = recipeArray[0];
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        res.render('view', { recipe }); // Pass the recipe object to the view
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update Recipe - Handle form submission
app.put('/recipes/:id', async (req, res) => {
    const { name, description, ingredients, instructions } = req.body;
    console.log('Updating recipe with ID:', req.params.id); // Debugging log
    console.log('Data received:', { name, description, ingredients, instructions }); // Debugging log
    try {
        const result = await updateRecipe(req.params.id, name, description, ingredients, instructions);
        console.log('Update result:', result); // Debugging log
        if (!result.success) {
            return res.status(404).send(result.message);
        }
        res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete Recipe
app.delete('/recipes/:id', async (req, res) => {
    try {
        await deleteRecipe(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});