-- Seed data: Admin and test users
-- Passwords are bcrypt hashed (password: 'password123')

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shopmart.com', '$2a$12$LQv7Kt8rNFt8yKGKRJQgke6e3FhHXGZ.PEX5hNlj5uWgVVK2mnmN2', 'admin'),
('Test User', 'user@shopmart.com', '$2a$12$LQv7Kt8rNFt8yKGKRJQgke6e3FhHXGZ.PEX5hNlj5uWgVVK2mnmN2', 'user');
