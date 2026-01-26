import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Grid from './components/Grid.tsx'
import EmployeeDetails from './components/EmployeeDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
