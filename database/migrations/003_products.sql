-- Migration: Create products table

CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  category_id  INT,
  name         VARCHAR(200) NOT NULL,
  slug         VARCHAR(220) UNIQUE NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  stock        INT DEFAULT 0,
  image_url    VARCHAR(500),
  rating       DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  featured     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_slug (slug),
  INDEX idx_featured (featured),
  INDEX idx_price (price)
);
