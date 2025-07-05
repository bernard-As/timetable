import { PrivateDefaultApi } from "../../utils/AxiosInstance";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data - replace with actual API calls
const mockCourses = [
  { id: 1, code: "CS101", name: "Introduction to Computer Science", isActive: true, department: "Computer Science" },
  { id: 2, code: "CS201", name: "Data Structures and Algorithms", isActive: true, department: "Computer Science" },
  { id: 3, code: "CS301", name: "Database Systems", isActive: true, department: "Computer Science" },
  { id: 4, code: "CS401", name: "Software Engineering", isActive: false, department: "Computer Science" },
  { id: 5, code: "MATH101", name: "Calculus I", isActive: true, department: "Mathematics" },
  { id: 6, code: "MATH201", name: "Linear Algebra", isActive: true, department: "Mathematics" },
  { id: 7, code: "MATH301", name: "Discrete Mathematics", isActive: true, department: "Mathematics" },
  { id: 8, code: "PHYS101", name: "Physics Fundamentals", isActive: true, department: "Physics" },
  { id: 9, code: "PHYS201", name: "Quantum Physics", isActive: false, department: "Physics" },
  { id: 10, code: "ENG101", name: "Technical Writing", isActive: true, department: "English" },
  { id: 11, code: "ENG201", name: "Advanced Composition", isActive: true, department: "English" },
  { id: 12, code: "BUS201", name: "Business Analytics", isActive: true, department: "Business" },
  { id: 13, code: "BUS301", name: "Project Management", isActive: true, department: "Business" },
  { id: 14, code: "STAT101", name: "Introduction to Statistics", isActive: true, department: "Statistics" },
  { id: 15, code: "STAT201", name: "Advanced Statistics", isActive: true, department: "Statistics" },
  { id: 16, code: "CHEM101", name: "General Chemistry", isActive: true, department: "Chemistry" },
  { id: 17, code: "CHEM201", name: "Organic Chemistry", isActive: false, department: "Chemistry" },
  { id: 18, code: "BIO101", name: "Introduction to Biology", isActive: true, department: "Biology" },
  { id: 19, code: "ECO101", name: "Microeconomics", isActive: true, department: "Economics" },
  { id: 20, code: "ECO201", name: "Macroeconomics", isActive: true, department: "Economics" }
];

export const courseService = {
  // Fetch all available courses
  async getAvailableCourses() {
    try {
      let courses = []
      // Simulate API delay
      await PrivateDefaultApi.get('/summer-course/').then((response) => {
        // Handle successful response
        console.log('Fetched courses:', response.data);
        courses = response.data;
      });

      // In production, replace with:
      // const response = await fetch(`${API_BASE_URL}/courses/active`);
      // if (!response.ok) throw new Error('Failed to fetch courses');
      // return await response.json();
      courses = courses.map(course => ({
        ...course,
        isActive: course.isActive === true // Ensure isActive is boolean
      }));
      // Return only active courses for student selection
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to load courses. Please try again later.');
    }
  },

  // Fetch courses by department
  async getCoursesByDepartment(department) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockCourses.filter(course => 
        course.isActive && course.department === department
      );
    } catch (error) {
      console.error('Error fetching courses by department:', error);
      throw new Error('Failed to load courses for this department.');
    }
  },

  // Submit student course selection
  async submitCourseSelection(studentNumber, selectedCourses) {
    try {
      await PrivateDefaultApi.post('/summer-student-selection/', {
        student_num	: studentNumber,
        summer_course: selectedCourses.map(c => c.id)
      });
      
      // In production, replace with:
      // const response = await fetch(`${API_BASE_URL}/students/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ studentNumber, courseIds: selectedCourses.map(c => c.id) })
      // });
      // if (!response.ok) throw new Error('Registration failed');
      // return await response.json();
      
      return {
        success: true,
        message: `Successfully registered ${selectedCourses.length} course(s)`,
        registrationId: Math.random().toString(36).substr(2, 9)
      };
    } catch (error) {
      console.error('Error submitting course selection:', error);
      throw new Error('Failed to submit course selection. Please try again.');
    }
  }
};