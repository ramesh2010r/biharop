#!/bin/bash

# Bihar Election Opinion Poll - Setup Script
# This script helps set up the database and environment

echo "=================================="
echo "Bihar Election Opinion Poll Setup"
echo "=================================="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL 8.0+ first."
    exit 1
fi

echo "✓ MySQL found"
echo ""

# Get database credentials
read -p "Enter MySQL root username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter MySQL root password: " DB_PASSWORD
echo ""

DB_NAME="bihar_election_poll"

# Create database
echo ""
echo "Creating database..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "❌ Failed to create database. Please check your credentials."
    exit 1
fi

# Import schema
echo "Importing database schema..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < backend/database/schema.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Schema imported successfully"
else
    echo "❌ Failed to import schema"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo ""
    echo "Creating backend/.env file..."
    
    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    
    cat > backend/.env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret for Admin Authentication
JWT_SECRET=$JWT_SECRET

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    
    echo "✓ Environment file created"
else
    echo "⚠ backend/.env already exists, skipping..."
fi

echo ""
echo "=================================="
echo "✓ Setup completed successfully!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Start the backend:  npm run backend:dev"
echo "2. Start the frontend: npm run dev"
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Password: admin123"
echo "⚠️  Please change these in production!"
echo ""
