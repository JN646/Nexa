// Imports
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';

function AdviserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Email: ${email}, Password: ${password}`);
    };

    return (
        <div className="App">
            <div className='container'>
                <h1>Adviser Login</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-4'>
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}
 
export default AdviserLogin;