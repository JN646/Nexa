// Imports
import React from 'react';
import TopNavbar from './components/TopNavbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Paraplanner from './pages/paraplanner';
import Adviser from './pages/adviser';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';
import Footer from './components/Footer';

function App() {
  return (
      <Router>
          <TopNavbar />
          <Routes>
              <Route path='/paraplanner' element={<Paraplanner />} />
              <Route path='/adviser' element={<Adviser />} />
          </Routes>
          <Footer />
      </Router>
  );
}

export default App;