// frontend/src/enrolment.jsx
import React, { useEffect, useState } from 'react'

const ENROL_API = 'http://localhost:5004'
const COURSE_API = 'http://localhost:5002'

export default function EnrolmentSection() {
  const [enrolments, setEnrolments] = useState([])
  const [studentName, setStudentName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [courses, setCourses] = useState([])

  // Fetch existing enrolments
  const fetchEnrolments = () => {
    fetch(`${ENROL_API}/enrolments`)
      .then(r => r.json())
      .then(setEnrolments)
  }

  // Fetch available courses (for dropdown)
  const fetchCourses = () => {
    fetch(`${COURSE_API}/courses`)
      .then(r => r.json())
      .then(setCourses)
  }

  // Add new enrolment
  const addEnrolment = async () => {
    if (!studentName || !courseCode) return
    const res = await fetch(`${ENROL_API}/enrolments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_name: studentName, course_code: courseCode })
    })
    if (res.ok) {
      setStudentName('')
      setCourseCode('')
      fetchEnrolments()
    }
  }

  // Delete enrolment
  const deleteEnrolment = async (id) => {
    await fetch(`${ENROL_API}/enrolments/${id}`, { method: 'DELETE' })
    fetchEnrolments()
  }

  useEffect(() => {
    fetchEnrolments()
    fetchCourses()
  }, [])

  return (
    <section className="enrol-section">
      <h2 className="enrol-title">🎓 Enrolments ({enrolments.length})</h2>
      <p>Manage which students are enrolled in which courses.</p>

      {/* Add enrolment form */}
      <div className="enrol-input">
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
        />

        {/* Dropdown for course selection */}
        <select
          value={courseCode}
          onChange={e => setCourseCode(e.target.value)}
        >
          <option value="">Select a course...</option>
          {courses.map(c => (
            <option key={c.id} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>

        <button className="btn-primary" onClick={addEnrolment}>Add Enrolment</button>
      </div>

      {/* Enrolment list */}
      <div className="enrol-list">
        {enrolments.map(e => (
          <div key={e.id} className="enrol-card">
            <span><strong>{e.student_name}</strong> → {e.course_code}</span>
            <button className="btn-danger" onClick={() => deleteEnrolment(e.id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  )
}
