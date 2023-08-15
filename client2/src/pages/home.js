import React from 'react';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';
 
function Home() {

  return (
    <div className="App">
      <div className='container'>
        <div id='jumbotron' className='row my-4'>
            <h1 className='display-2 text-center'>ParaplannerNexa</h1>
            <p className='lead text-center'>The SJP Paraplanning Marketplace</p>
        </div>

        {/* Row */}
        <div className='row'>
            <div className='col-6 text-center'>
                <h2>Paraplanner</h2>
                {/* Link to Paraplanner Login */}
                <div className='row'>
                    <a href='/paraplanner/login'>Paraplanner Login</a>
                </div>

                {/* Link to Paraplanner Register */}
                <div className='row'>
                    <a href='/paraplanner/register'>Paraplanner Register</a>
                </div>
            </div>

            <div className='col-6 text-center'>
                <h2>Adviser</h2>
                {/* Link to Adviser Login */}
                <div className='row'>
                    <a href='/adviser/login'>Adviser Login</a>
                </div>

                {/* Link to Adviser Register */}
                <div className='row'>
                    <a href='/adviser/register'>Adviser Register</a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
 
export default Home;