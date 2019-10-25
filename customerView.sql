DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("cleats", "soccer", 50.00, 20),
	   ("jerseys", "basketball", 100.00, 10),
	   ("helmet", "football", 50.00, 5),
	   ("jersey", "hockey", 150.00, 15),
	   ("pants", "football", 30.00, 15),
	   ("shorts", "soccer", 20.00, 20),
	   ("gloves", "baseball", 50.00, 10),
	   ("bats", "baseball", 100.00, 10),
	   ("pucks", "hockey",5.00, 20),
	   ("shoes", "basketball", 100.00, 20)