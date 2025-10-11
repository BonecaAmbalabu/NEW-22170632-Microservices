// frontend/src/feedback.jsx
import React, { useEffect, useState } from 'react'

const FEEDBACK_API = 'http://localhost:5003'

export default function FeedbackSection() {
  const [feedbackList, setFeedbackList] = useState([])
  const [studentName, setStudentName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [comment, setComment] = useState('')

  const fetchFeedback = () => {
    fetch(`${FEEDBACK_API}/feedback`)
      .then(r => r.json())
      .then(setFeedbackList)
  }

  const addFeedback = async () => {
    if (!studentName || !courseCode || !comment) return
    const res = await fetch(`${FEEDBACK_API}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_name: studentName, course_code: courseCode, comment })
    })
    if (res.ok) {
      setStudentName('')
      setCourseCode('')
      setComment('')
      fetchFeedback()
    }
  }

  useEffect(() => { fetchFeedback() }, [])

  return (
    <section className="feedback-section">
      <h2 className="feedback-title">💬 Feedback ({feedbackList.length})</h2>

      {/* Feedback Input Box */}
      <div className="feedback-input">
        <div className="feedback-fields">
          <input
            type="text"
            placeholder="Your name"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course code (e.g. COMP601)"
            value={courseCode}
            onChange={e => setCourseCode(e.target.value)}
          />
        </div>
        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button className="btn-primary" onClick={addFeedback}>Submit</button>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {feedbackList.map(f => (
          <div key={f.id} className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-avatar">{f.student_name.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{f.student_name}</strong> · <span className="course-code">{f.course_code}</span>
              </div>
            </div>
            <p className="feedback-comment">{f.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
