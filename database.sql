-- Create database
CREATE DATABASE IF NOT EXISTS course_registration;
USE course_registration;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Insert sample data
INSERT INTO students (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

INSERT INTO courses (course_name, instructor, capacity) VALUES
('Introduction to Programming', 'Dr. Smith', 30),
('Database Management', 'Prof. Johnson', 25),
('Web Development', 'Dr. Williams', 35);

CALL AddNewStudent('Student Name', 'student@email.com');

SET @course_count = 0;
CALL GetStudentCourseCount(1, @course_count);
SELECT @course_count;

SELECT course_name, IsCourseFull(id) as is_full
FROM courses;

SELECT * FROM course_availability; 