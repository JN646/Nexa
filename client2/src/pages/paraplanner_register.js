// Imports
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';

function ParaplannerLogin() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [level4, setLevel4] = useState('');
    const [chartered, setChartered] = useState('');
    const [sjpYears, setSjpYears] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const data = {
            pp_firstname: firstname,
            pp_lastname: lastname,
            pp_email: email,
            pp_password: password,
            pp_tel: telephone,
            pp_level4: level4,
            pp_chartered: chartered,
            pp_sjp_years: sjpYears
        };

        axios.post('/api/paraplanners/create', data)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setTelephone('');
        setLevel4('');
        setChartered('');
        setSjpYears('');
    };
    return (
        <div className="App">
            <div className='container'>
                <h1>Paraplanner Register</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='firstname'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter first name'
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='lastname'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter last name'
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='telephone'>
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter telephone'
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='level4'>
                        <Form.Label>Level 4</Form.Label>
                        <Form.Control
                            type="checkbox"
                            value={level4}
                            onChange={(e) => setLevel4(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='chartered'>
                        <Form.Label>Chartered</Form.Label>
                        <Form.Control
                            type="checkbox"
                            value={chartered}
                            onChange={(e) => setChartered(e.target.value)}
                        ></Form.Control>
                    </Form.Group>   
                    <Form.Group controlId='sjpYears'>
                        <Form.Label>SJP Years</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Enter SJP years'
                            value={sjpYears}
                            onChange={(e) => setSjpYears(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary' className='pt-4'>
                        Register
                    </Button>
                </Form>
            </div>
        </div>
    );
}
 
export default ParaplannerLogin;