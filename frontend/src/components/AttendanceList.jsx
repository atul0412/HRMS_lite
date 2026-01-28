export default function AttendanceList({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="empty-state">
        <p>No attendance records. Use the form above to mark attendance, or adjust filters.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td><code style={{ fontFamily: 'var(--font-mono)' }}>{r.employee_identifier ?? r.employee_id}</code></td>
              <td>{r.employee_name ?? '—'}</td>
              <td>
                <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
