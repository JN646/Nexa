// Imports
import React from 'react';
import TopNavbar from './components/page_elements/TopNavbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import NotFound from './pages/notFound';
import Home from './pages/home';
import Paraplanner from './pages/paraplanner';
import Adviser from './pages/adviser';
import ParaplannerLogin from './pages/paraplanner_login';
import AdviserLogin from './pages/adviser_login';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';
import Footer from './components/page_elements/Footer';

function App() {
  return (
      <Router>
          <TopNavbar />
          <Routes>
                <Route path='*' element={<NotFound />} />
              <Route path='/' element={<Home />} />
              <Route path='/paraplanner' element={<Paraplanner />} />
              <Route path='/adviser' element={<Adviser />} />
              <Route path='/login/paraplanner' element={<ParaplannerLogin />} />
              <Route path='/login/adviser' element={<AdviserLogin />} />
          </Routes>
          <Footer />
      </Router>
  );
}

export default App;