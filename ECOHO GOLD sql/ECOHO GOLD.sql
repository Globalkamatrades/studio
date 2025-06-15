-- Create the database
CREATE DATABASE IF NOT EXISTS `ECOHO GOLD sql`;

-- Use the database
USE `ECOHO GOLD sql`;

-- Create the table
CREATE TABLE ecoho_gold_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    value INT
);

-- Insert sample data
INSERT INTO ecoho_gold_data (name, value) VALUES ('Sample Item 1', 100);
INSERT INTO ecoho_gold_data (name, value) VALUES ('Sample Item 2', 250);
INSERT INTO ecoho_gold_data (name, value) VALUES ('Sample Item 3', 175);