import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

export const getRecipes = async () => {
    const [rows] = await pool.execute('SELECT * FROM recipes');
    return rows;
};

export const getRecipeById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM recipes WHERE id = ?', [id]);
    return rows[0]; // Return the first row (the recipe)
};

export const addRecipe = async (name, description, ingredients, instructions) => {
    await pool.execute(
        'INSERT INTO recipes (name, description, ingredients, instructions) VALUES (?, ?, ?, ?)',
        [name, description, ingredients, instructions]
    );
};

export const updateRecipe = async (id, name, description, ingredients, instructions) => {
    await pool.execute(
        'UPDATE recipes SET name = ?, description = ?, ingredients = ?, instructions = ? WHERE id = ?',
        [name, description, ingredients, instructions, id]
    );
};

export const deleteRecipe = async (id) => {
    await pool.execute('DELETE FROM recipes WHERE id = ?', [id]);
};