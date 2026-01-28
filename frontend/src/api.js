/** Base URL for API. Set VITE_API_URL in .env for production (e.g. https://your-backend.onrender.com) */
const BASE = import.meta.env.VITE_API_URL || ''

async function handleRes(res) {
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { detail: text || 'Unknown error' }
  }
  if (!res.ok) {
    const msg = Array.isArray(data.detail) ? data.detail.map((e) => e.msg || JSON.stringify(e)).join(', ') : (data.detail || res.statusText)
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
  }
  return data
}

export const api = {
  async getEmployees() {
    const res = await fetch(`${BASE}/api/employees`)
    return handleRes(res)
  },

  async addEmployee(body) {
    const res = await fetch(`${BASE}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return handleRes(res)
  },

  async deleteEmployee(employeeId) {
    const res = await fetch(`${BASE}/api/employees/${encodeURIComponent(employeeId)}`, { method: 'DELETE' })
    return handleRes(res)
  },

  async markAttendance(body) {
    const res = await fetch(`${BASE}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return handleRes(res)
  },

  async getAttendanceForEmployee(employeeId, fromDate, toDate) {
    const params = new URLSearchParams()
    if (fromDate) params.set('from_date', fromDate)
    if (toDate) params.set('to_date', toDate)
    const q = params.toString() ? `?${params}` : ''
    const res = await fetch(`${BASE}/api/attendance/employee/${encodeURIComponent(employeeId)}${q}`)
    return handleRes(res)
  },

  async getAllAttendance(fromDate, toDate) {
    const params = new URLSearchParams()
    if (fromDate) params.set('from_date', fromDate)
    if (toDate) params.set('to_date', toDate)
    const q = params.toString() ? `?${params}` : ''
    const res = await fetch(`${BASE}/api/attendance${q}`)
    return handleRes(res)
  },

  async getAttendanceSummary() {
    const res = await fetch(`${BASE}/api/attendance/summary`)
    return handleRes(res)
  },
}
