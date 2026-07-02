-- Run this once to create the database (Flask-SQLAlchemy will create the table automatically on first run)
CREATE DATABASE IF NOT EXISTS product_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE product_management;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
