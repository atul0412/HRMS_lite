import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import MarkAttendanceForm from '../components/MarkAttendanceForm'
import AttendanceList from '../components/AttendanceList'

export default function Attendance() {
  const [employees, setEmployees] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [error, setError] = useState(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [filterEmployeeId, setFilterEmployeeId] = useState('')

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await api.getEmployees()
      setEmployees(data)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true)
    setError(null)
    try {
      if (filterEmployeeId) {
        const data = await api.getAttendanceForEmployee(filterEmployeeId, fromDate || undefined, toDate || undefined)
        setRecords(data)
      } else {
        const data = await api.getAllAttendance(fromDate || undefined, toDate || undefined)
        setRecords(data)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingRecords(false)
    }
  }, [filterEmployeeId, fromDate, toDate])

  useEffect(() => {
    setLoading(true)
    fetchEmployees().finally(() => setLoading(false))
  }, [fetchEmployees])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleMark = async (body) => {
    setError(null)
    await api.markAttendance(body)
    fetchRecords()
  }

  return (
    <>
      <h1 className="section-title">Attendance Management</h1>

      <MarkAttendanceForm employees={employees} onSubmit={handleMark} onError={setError} disabled={loading} />

      {error && (
        <div className="card error-state">
          <p className="message">{error}</p>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Attendance Records</h2>
        <div className="filter-row">
          <div className="form-group">
            <label>Employee</label>
            <select
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
              disabled={loading}
            >
              <option value="">All employees</option>
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>{e.employee_id} – {e.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={fetchRecords}>Apply</button>
        </div>
        {loadingRecords && <div className="loading" />}
        {!loadingRecords && <AttendanceList records={records} />}
      </div>
    </>
  )
}
