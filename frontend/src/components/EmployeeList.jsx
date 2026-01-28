export default function EmployeeList({ employees, onDelete }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <p>No employees yet. Add one using the form above.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th style={{ width: 90 }}></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employee_id}>
              <td><code style={{ fontFamily: 'var(--font-mono)' }}>{emp.employee_id}</code></td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(emp.employee_id)}
                  aria-label={`Delete ${emp.employee_id}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
