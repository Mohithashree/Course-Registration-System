# Course Registration System

A simple course registration system built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- MySQL Workbench (for database management)

## Setup Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up the MySQL database:
   - Open MySQL Workbench
   - Create a new connection if you haven't already
   - Open the `database.sql` file
   - Execute the SQL script to create the database and tables

3. Configure the database connection:
   - Open `server.js`
   - Update the database connection details (host, user, password) according to your MySQL setup

4. Start the application:
   ```bash
   npm start
   ```

5. Access the application:
   - Open your web browser
   - Navigate to `http://localhost:3000`

## Features

- View available courses
- Register for courses
- View your course registrations
- Simple and intuitive user interface

## Project Structure

- `server.js` - Main application file
- `database.sql` - Database schema and sample data
- `public/index.html` - Frontend interface
- `package.json` - Project dependencies and scripts

## API Endpoints

- `GET /api/courses` - Get all available courses
- `POST /api/register` - Register for a course
- `GET /api/registrations/:student_id` - Get student's course registrations 