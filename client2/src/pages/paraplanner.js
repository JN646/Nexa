import React from 'react';
import CaseList from '../components/CaseList';
import ParaplannerCaseList from '../components/ParaplannerCaseList';
import ParaplannerDoneCaseList from '../components/ParaplannerDoneCaseList';
import ParaplannerLostCaseList from '../components/ParaplannerLostCaseList';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';
 
function Paraplanner() {

  return (
    <div className="App">
      <div className='container-fluid'>
        <h1>Available Cases</h1>
        <p>Click on a case to view details and bid on it.</p>
        <CaseList />
      </div>
      <hr />
      <div className='container-fluid'>
        <h1>My Open Cases</h1>
        <ParaplannerCaseList />

        <h1>My Done Cases</h1>
        <ParaplannerDoneCaseList />

        <h1>My Lost Cases</h1>
        <ParaplannerLostCaseList />
      </div>
    </div>
  );
}
 
export default Paraplanner;