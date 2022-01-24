CREATE TABLE order_products(
    id SERIAL PRIMARY KEY,
    quantity integer,
    product_id INTEGER,
    order_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)