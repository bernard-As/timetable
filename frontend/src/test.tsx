import React, { useState } from 'react';

interface Course {
  code: string;
  title: string;
  description: string;
  status: string;
}

interface Group {
  lecturer: string;
  assistant: string;
  faculty: string;
  department: string;
  program: string;
}

const CreateCourse: React.FC = () => {
  const [course, setCourse] = useState<Course>({
    code: '',
    title: '',
    description: '',
    status: '',
  });
  const [groups, setGroups] = useState<Group[]>([{ lecturer: '', assistant: '', faculty: '', department: '', program: '' }]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [name]: value };
    setGroups(newGroups);
  };

  const addGroup = () => {
    setGroups([...groups, { lecturer: '', assistant: '', faculty: '', department: '', program: '' }]);
  };

  const removeGroup = (index: number) => {
    const newGroups = [...groups];
    newGroups.splice(index, 1);
    setGroups(newGroups);
  };

  return (
    <div>
      <h2>Create Course</h2>
      <input type="text" name="code" value={course.code} onChange={handleCourseChange} placeholder="Course Code" />
      <input type="text" name="title" value={course.title} onChange={handleCourseChange} placeholder="Course Title" />
      {/* <textarea name="description" value={course.description} onChange={handleCourseChange} placeholder="Description"></textarea> */}
      <input type="text" name="status" value={course.status} onChange={handleCourseChange} placeholder="Status" />

      <h2>Groups</h2>
      {groups.map((group, index) => (
        <div key={index}>
          <h3>Group {index + 1}</h3>
          <input type="text" name="lecturer" value={group.lecturer} onChange={(e) => handleGroupChange(e, index)} placeholder="Lecturer" />
          {/* Add inputs for assistant, faculty, department, program */}
          <button onClick={() => removeGroup(index)}>Remove Group</button>
        </div>
      ))}
      <button onClick={addGroup}>Add Group</button>
    </div>
  );
};

export default CreateCourse;
