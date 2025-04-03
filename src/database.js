import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();

// Fetch all recipes
export const getRecipes = async () => {
    try {
        const [results] = await pool.execute('CALL GetAllRecipes');
        return results[0]; // Access the first result set
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('Failed to fetch recipes');
    }
};

// Fetch a recipe by ID
export const getRecipeById = async (id) => {
    try {
        const [rows] = await pool.execute('CALL GetRecipeById(?)', [id]);
        if (!rows || rows.length === 0) {
            throw new Error('No recipe found with the given ID');
        }
        return rows[0]; // Return the first row (the recipe)
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        throw new Error('Failed to fetch recipe by ID');
    }
};

// Add a new recipe
export const addRecipe = async (name, description, ingredients, instructions) => {
    const connection = await pool.getConnection();
    try {
        console.log('Adding recipe:', { name, description, ingredients, instructions }); // Debugging log
        const [result] = await connection.query(
            'CALL AddRecipe(?, ?, ?, ?)',
            [name, description, ingredients, instructions]
        );
        if (!result || result.length === 0) {
            throw new Error('Failed to add recipe');
        }
        console.log('Recipe added with ID:', result[0][0].new_id); // Debugging log
        return result[0][0].new_id; // Return the new recipe ID
    } catch (error) {
        console.error('Error adding recipe:', error);
        throw new Error('Failed to add recipe');
    } finally {
        connection.release();
    }
};

// Update an existing recipe
export const updateRecipe = async (id, name, description, ingredients, instructions) => {
    const connection = await pool.getConnection();
    try {
        console.log('Updating recipe with ID:', id); // Debugging log
        await connection.beginTransaction();

        // Call the stored procedure
        const [result] = await connection.query(
            'CALL UpdateRecipe(?, ?, ?, ?, ?)',
            [id, name, description, ingredients, instructions]
        );

        await connection.commit();

        const affectedRows = result[0][0].affected_rows;
        console.log('Rows affected:', affectedRows); // Debugging log

        return {
            success: affectedRows > 0,
            message: affectedRows > 0
                ? 'Recipe updated successfully'
                : 'No recipe found with that ID',
        };
    } catch (error) {
        await connection.rollback();
        console.error('Error updating recipe:', error);
        return {
            success: false,
            error: error.message,
        };
    } finally {
        connection.release();
    }
};

// Delete a recipe
export const deleteRecipe = async (id) => {
    try {
        console.log('Deleting recipe with ID:', id); // Debugging log
        const [result] = await pool.execute('DELETE FROM recipes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('No recipe found with the given ID');
        }
        console.log('Recipe deleted successfully'); // Debugging log
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw new Error('Failed to delete recipe');
    }
};