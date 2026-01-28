import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import EmployeeList from '../components/EmployeeList'
import AddEmployeeForm from '../components/AddEmployeeForm'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getEmployees()
      setEmployees(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleAdd = async (body) => {
    setError(null)
    await api.addEmployee(body)
    fetchEmployees()
  }

  const handleDelete = async (employeeId) => {
    if (!confirm(`Delete employee ${employeeId}?`)) return
    setError(null)
    try {
      await api.deleteEmployee(employeeId)
      fetchEmployees()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1 className="section-title">Employee Management</h1>

      <AddEmployeeForm onSubmit={handleAdd} onError={setError} />

      {error && (
        <div className="card error-state">
          <p className="message">{error}</p>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">All Employees</h2>
        {loading && <div className="loading" />}
        {!loading && <EmployeeList employees={employees} onDelete={handleDelete} />}
      </div>
    </>
  )
}
