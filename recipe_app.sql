CREATE DATABASE recipe_app;

USE recipe_app;

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL
);

INSERT INTO recipes (name, description, ingredients, instructions) VALUES
('Spaghetti Bolognese', 'A classic Italian pasta dish with a rich meat sauce.', 'Spaghetti, ground beef, tomato sauce, onions, garlic, olive oil, salt, pepper', '1. Cook spaghetti. 2. Prepare the meat sauce. 3. Combine and serve.'),
('Chicken Curry', 'A flavorful and spicy chicken curry.', 'Chicken, curry powder, coconut milk, onions, garlic, ginger, salt, pepper', '1. Sauté onions, garlic, and ginger. 2. Add chicken and curry powder. 3. Pour in coconut milk and simmer.'),
('Vegetable Stir Fry', 'A quick and healthy vegetable stir fry.', 'Broccoli, carrots, bell peppers, soy sauce, garlic, ginger, sesame oil', '1. Heat sesame oil. 2. Stir fry vegetables. 3. Add soy sauce and serve.'),
('Beef Tacos', 'Mexican-style beef tacos with fresh toppings.', 'Ground beef, taco seasoning, tortillas, lettuce, tomatoes, cheese, sour cream', '1. Cook beef with taco seasoning. 2. Assemble tacos with toppings. 3. Serve.'),
('Pancakes', 'Fluffy pancakes perfect for breakfast.', 'Flour, eggs, milk, sugar, baking powder, butter, syrup', '1. Mix ingredients. 2. Cook on a griddle. 3. Serve with syrup.'),
('Caesar Salad', 'A classic Caesar salad with creamy dressing.', 'Romaine lettuce, croutons, Parmesan cheese, Caesar dressing', '1. Toss lettuce with dressing. 2. Add croutons and Parmesan. 3. Serve.');