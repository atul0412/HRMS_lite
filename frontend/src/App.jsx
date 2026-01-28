import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
