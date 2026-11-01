-- Source: MySQL 8 — customer orders schema
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('placed','shipped','delivered') NOT NULL DEFAULT 'placed',
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

-- Report: lifetime value per customer
CREATE VIEW customer_lifetime_value AS
SELECT c.id, c.email, IFNULL(SUM(o.total), 0) AS lifetime_value, COUNT(o.id) AS order_count
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.email;
