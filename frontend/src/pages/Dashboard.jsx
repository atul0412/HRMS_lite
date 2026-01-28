import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Dashboard() {
  const [employeesCount, setEmployeesCount] = useState(null)
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([api.getEmployees(), api.getAttendanceSummary()])
      .then(([employees, sum]) => {
        if (!cancelled) {
          setEmployeesCount(employees.length)
          setSummary(sum)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <div className="loading" style={{ minHeight: 200 }} />
  }

  if (error) {
    return (
      <div className="card error-state">
        <p className="message">{error}</p>
      </div>
    )
  }

  const totalPresent = summary.reduce((a, s) => a + s.present_days, 0)

  return (
    <>
      <h1 className="section-title">Dashboard</h1>
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="summary-card">
          <div>
            <div className="label">Total Employees</div>
            <div className="value">{employeesCount ?? 0}</div>
          </div>
        </div>
        <div className="summary-card">
          <div>
            <div className="label">Total Present Days (all)</div>
            <div className="value">{totalPresent}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="card-title">Present Days per Employee</h2>
        {summary.length === 0 ? (
          <div className="empty-state">
            <p>No attendance data yet. Mark attendance from the Attendance page.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Present days</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((s) => (
                  <tr key={s.employee_id}>
                    <td>{s.employee_id}</td>
                    <td>{s.full_name}</td>
                    <td><strong>{s.present_days}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
