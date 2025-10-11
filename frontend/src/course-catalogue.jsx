// frontend/src/course-catalogue.jsx
import React, { useEffect, useState } from 'react'

const COURSE_API = 'http://localhost:5002'

export default function CourseCatalogue() {
  const [courses, setCourses] = useState([])
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const fetchCourses = () => {
    fetch(`${COURSE_API}/courses`)
      .then(r => r.json())
      .then(setCourses)
  }

  const addCourse = async () => {
    if (!code || !title || !description) return
    const res = await fetch(`${COURSE_API}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, title, description })
    })
    if (res.ok) {
      setCode('')
      setTitle('')
      setDescription('')
      fetchCourses()
    }
  }

  useEffect(() => { fetchCourses() }, [])

  return (
    <section className="card" style={{ marginTop: '40px' }}>
      <h2>Course Catalogue ({courses.length})</h2>

      <div className="grid-2">
        <div>
          <h3>Add Course</h3>
          <input placeholder="Course Code" value={code} onChange={e => setCode(e.target.value)} />
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="btn-primary" onClick={addCourse}>Add</button>
        </div>

        <div>
          <h3>Available Courses</h3>
          <ul>
            {courses.map(c => (
              <li key={c.id}>
                <strong>{c.code}</strong> — {c.title}<br />
                <small>{c.description}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
