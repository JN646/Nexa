import React from 'react';
import CaseList from '../components/CaseList';
import ParaplannerCaseList from '../components/ParaplannerCaseList';
import ParaplannerDoneCaseList from '../components/ParaplannerDoneCaseList';
import ParaplannerLostCaseList from '../components/ParaplannerLostCaseList';

function Paraplanner() {
  return (
    <div className='container-fluid'>
      <div>
        <h3>Available Cases</h3>
        <p>Click on a case to view details and bid on it.</p>
        <CaseList />
      </div>
      <hr />
      <div>
        <h3>My Open Cases</h3>
        <ParaplannerCaseList />

        <h3>My Done Cases</h3>
        <ParaplannerDoneCaseList />

        <h3>My Lost Bids</h3>
        <ParaplannerLostCaseList />
      </div>
    </div>
  );
}

export default Paraplanner;