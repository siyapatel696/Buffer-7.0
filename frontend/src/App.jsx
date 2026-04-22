import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import BulkConsumerPortal from './pages/BulkConsumerPortal'
import CollectorPortal from './pages/CollectorPortal'
import RecyclerPortal from './pages/RecyclerPortal'

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/bulk-consumer/*" element={<BulkConsumerPortal />} />
          <Route path="/collector/*"    element={<CollectorPortal />} />
          <Route path="/recycler/*"     element={<RecyclerPortal />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
