import { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)

export default function MarkAttendanceForm({ employees, onSubmit, onError, disabled }) {
  const [employeeId, setEmployeeId] = useState('')
  const [date, setDate] = useState(today)
  const [status, setStatus] = useState('Present')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    onError?.(null)
    if (!employeeId.trim()) {
      onError?.('Please select an employee.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ employee_id: employeeId, date, status })
      setDate(today)
      setStatus('Present')
    } catch (err) {
      onError?.(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Mark Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="att-employee">Employee *</label>
            <select
              id="att-employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              disabled={disabled}
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.employee_id} – {e.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="att-date">Date *</label>
            <input
              id="att-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="att-status">Status *</label>
            <select
              id="att-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting || disabled}>
            {submitting ? 'Saving…' : 'Mark Attendance'}
          </button>
        </div>
      </form>
    </div>
  )
}
