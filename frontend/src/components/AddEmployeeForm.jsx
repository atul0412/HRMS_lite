import { useState } from 'react'

const defaultForm = { employee_id: '', full_name: '', email: '', department: '' }

export default function AddEmployeeForm({ onSubmit, onError }) {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onError?.(null)
    if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
      onError?.('All fields are required.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department.trim(),
      })
      setForm(defaultForm)
    } catch (err) {
      onError?.(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emp-id">Employee ID *</label>
            <input
              id="emp-id"
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="full-name">Full Name *</label>
            <input
              id="full-name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Engineering"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  )
}
