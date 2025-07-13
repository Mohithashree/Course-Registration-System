USE course_registration;

-- 1. Create a stored procedure to add a new student
DELIMITER //
CREATE PROCEDURE AddNewStudent(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100)
)
BEGIN
    INSERT INTO students (name, email) VALUES (p_name, p_email);
END //
DELIMITER ;

-- 2. Create a stored procedure to get student's course count
DELIMITER //
CREATE PROCEDURE GetStudentCourseCount(
    IN p_student_id INT,
    OUT p_course_count INT
)
BEGIN
    SELECT COUNT(*) INTO p_course_count
    FROM registrations
    WHERE student_id = p_student_id;
END //
DELIMITER ;

-- 3. Create a function to check if a course is full
DELIMITER //
CREATE FUNCTION IsCourseFull(p_course_id INT) 
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE current_count INT;
    DECLARE max_capacity INT;
    
    SELECT COUNT(*) INTO current_count
    FROM registrations
    WHERE course_id = p_course_id;
    
    SELECT capacity INTO max_capacity
    FROM courses
    WHERE id = p_course_id;
    
    RETURN current_count >= max_capacity;
END //
DELIMITER ;

-- 4. Create a trigger to log course registrations
CREATE TABLE registration_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    action VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER after_registration_insert
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    INSERT INTO registration_log (student_id, course_id, action)
    VALUES (NEW.student_id, NEW.course_id, 'REGISTER');
END //
DELIMITER ;

-- 5. Create a view for course availability
CREATE VIEW course_availability AS
SELECT 
    c.id,
    c.course_name,
    c.instructor,
    c.capacity,
    COUNT(r.id) as current_enrollment,
    (c.capacity - COUNT(r.id)) as available_slots
FROM courses c
LEFT JOIN registrations r ON c.id = r.course_id
GROUP BY c.id;

-- Example usage of the procedures and functions:

-- Add a new student
CALL AddNewStudent('Alice Johnson', 'alice@example.com');

-- Get student's course count
SET @course_count = 0;
CALL GetStudentCourseCount(1, @course_count);
SELECT @course_count as 'Number of courses enrolled';

-- Check if a course is full
SELECT course_name, IsCourseFull(id) as is_full
FROM courses;

-- View course availability
SELECT * FROM course_availability; 