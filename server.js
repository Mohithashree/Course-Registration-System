const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456789', // Updated MySQL password
    database: 'course_registration',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Convert pool to use promises
const promisePool = pool.promise();

// Test database connection
async function testConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('Successfully connected to MySQL database');
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        process.exit(1);
    }
}

// Test the connection
testConnection();

// Student CRUD Operations
// Create - Add new student
app.post('/api/students', async (req, res) => {
    try {
        const { name, email } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO students (name, email) VALUES (?, ?)',
            [name, email]
        );
        res.json({ message: 'Student added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: error.message });
    }
});

// Read - Get all students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM students');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: error.message });
    }
});

// Read - Get single student
app.get('/api/students/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM students WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update - Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const [result] = await promisePool.query(
            'UPDATE students SET name = ?, email = ? WHERE id = ?',
            [name, email, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete - Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query(
            'DELETE FROM students WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: error.message });
    }
});

// Course CRUD Operations
// Create - Add new course
app.post('/api/courses', async (req, res) => {
    try {
        const { course_name, instructor, capacity } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO courses (course_name, instructor, capacity) VALUES (?, ?, ?)',
            [course_name, instructor, capacity]
        );
        res.json({ message: 'Course added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: error.message });
    }
});

// Read - Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM course_availability');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Read - Get single course
app.get('/api/courses/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM courses WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update - Update course
app.put('/api/courses/:id', async (req, res) => {
    try {
        const { course_name, instructor, capacity } = req.body;
        const [result] = await promisePool.query(
            'UPDATE courses SET course_name = ?, instructor = ?, capacity = ? WHERE id = ?',
            [course_name, instructor, capacity, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete - Delete course
app.delete('/api/courses/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query(
            'DELETE FROM courses WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: error.message });
    }
});

// Registration Operations
app.post('/api/register', async (req, res) => {
    const { student_id, course_id } = req.body;
    try {
        // Check if course is full
        const [isFull] = await promisePool.query(
            'SELECT IsCourseFull(?) as is_full',
            [course_id]
        );
        
        if (isFull[0].is_full) {
            return res.status(400).json({ error: 'Course is full' });
        }

        const [result] = await promisePool.query(
            'INSERT INTO registrations (student_id, course_id) VALUES (?, ?)',
            [student_id, course_id]
        );
        res.json({ message: 'Registration successful', id: result.insertId });
    } catch (error) {
        console.error('Error registering for course:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/registrations/:student_id', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            `SELECT r.*, c.course_name, c.instructor
            FROM registrations r
            JOIN courses c ON r.course_id = c.id
            WHERE r.student_id = ?`,
            [req.params.student_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/registrations/:registration_id', async (req, res) => {
    try {
        await promisePool.query(
            'DELETE FROM registrations WHERE id = ?',
            [req.params.registration_id]
        );
        res.json({ message: 'Course dropped successfully' });
    } catch (error) {
        console.error('Error dropping course:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 