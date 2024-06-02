import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $username: String!,
    $password: String!,
    $role: String!,
    $email: String,
    $phone: String,
    $street: String,
    $city: String,
    $province: String,
    $zipcode: String,
    $restaurantName: String,
    $registrationNumber: String
  ) {
    signup(
      username: $username,
      password: $password,
      role: $role,
      email: $email,
      phone: $phone,
      street: $street,
      city: $city,
      province: $province,
      zipcode: $zipcode,
      restaurantName: $restaurantName,
      registrationNumber: $registrationNumber
    ) {
      id
      username
      role
    }
  }
`;

const Signup = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (role === 'Admin') {
      handleSubmitStep2(e);
    } else {
      setStep(2);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    try {
      await signup({
        variables: {
          username,
          password,
          role,
          email,
          phone,
          street,
          city,
          province,
          zipcode,
          restaurantName,
          registrationNumber,
        },
      });
      navigate('/login?signup=success');
    } catch (e) {
      console.error('Error during signup:', e);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Sign Up</h2>
      {step === 1 && (
        <Form onSubmit={handleSubmitStep1} className="form-signup">
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Merchant">Merchant</option>
              <option value="Admin">Admin</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-block">Next</Button>
        </Form>
      )}
      {step === 2 && role === 'Customer' && (
        <Form onSubmit={handleSubmitStep2} className="form-signup">
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formStreet">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProvince">
            <Form.Label>Province</Form.Label>
            <Form.Control
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formZipcode">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-block">Sign Up</Button>
        </Form>
      )}
      {step === 2 && role === 'Merchant' && (
        <Form onSubmit={handleSubmitStep2} className="form-signup">
          <Form.Group controlId="formRestaurantName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRegistrationNumber">
            <Form.Label>Restaurant Registration Number</Form.Label>
            <Form.Control
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formStreet">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formProvince">
            <Form.Label>Province</Form.Label>
            <Form.Control
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formZipcode">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-block">Sign Up</Button>
        </Form>
      )}
      <div className="text-center mt-3">
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">Error signing up: {error.message}</p>}
        {data && <p className="text-success">Sign up successful: {data.signup.username}</p>}
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </Container>
  );
};

export default Signup;