import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import {Container, Form, Button, Row, Col, Card, } from 'react-bootstrap';

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
  const [errors, setErrors] = useState({});
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password ) errors.password = 'Password is required';
    else if(password.length < 8) errors.password ='Password must be at least 8 characters'
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const zipRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    const registrationNumberRegex = /^[A-Z][A-Z0-9]{9}$/;

    if (!email || !emailRegex.test(email)) errors.email = 'Valid email is required';
    if (!phone ) errors.phone = 'Phone number is required';
    else if(!phoneRegex.test(phone)) errors.phone ='Enter Valid number(format: xxx-xxx-xxxx)' ;
    if (role === 'Customer') {
      if (!street) errors.street = 'Street is required';
      if (!city) errors.city = 'City is required';
      if (!province) errors.province = 'Province is required';
      if (!zipcode) errors.zipcode = 'zip code is required';
      if (!zipRegex.test(zipcode)) errors.zipcode = 'Enter zip code in A1A 1A1 format';
    }
    if (role === 'Merchant') {
      if (!restaurantName) errors.restaurantName = 'Restaurant name is required';
      if (!registrationNumber  ) {
        errors.registrationNumber = 'Valid restaurant registration number is required';
      }
      else if(!registrationNumberRegex.test(registrationNumber)) errors.registrationNumber = 'Valid restaurant registration number is format X111111111';
      if (!street) errors.street = 'Street is required';
      if (!city) errors.city = 'City is required';
      if (!province) errors.province = 'Province is required';
      if (!zipcode) errors.zipcode = 'zip code is required';
      if (!zipRegex.test(zipcode)) errors.zipcode = 'Enter zip code in A1A 1A1 format';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    if (validateStep2()) {
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
    }
  };

  return (
    <Container className="mt-4">
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="shadow-lg">
          <Card.Body className="p-4">
            <h2 className="text-center">Sign Up</h2>
            {step === 1 && (
              <Form onSubmit={handleSubmitStep1} className="form-signup">
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
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
                <Button variant="primary" type="submit" className="btn-block">
                  Next
                </Button>
              </Form>
            )}
            {step === 2 && (
              <Form onSubmit={handleSubmitStep2} className="form-signup">
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
                {role === 'Customer' && (
                  <>
                    <Form.Group controlId="formStreet">
                      <Form.Label>Street</Form.Label>
                      <Form.Control
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        isInvalid={!!errors.street}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formProvince">
                      <Form.Label>Province</Form.Label>
                      <Form.Control
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        isInvalid={!!errors.province}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.province}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formZipcode">
                      <Form.Label>Zipcode</Form.Label>
                      <Form.Control
                        type="text"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        isInvalid={!!errors.zipcode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zipcode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
                {role === 'Merchant' && (
                  <>
                    <Form.Group controlId="formRestaurantName">
                      <Form.Label>Restaurant Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        isInvalid={!!errors.restaurantName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.restaurantName}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formRegistrationNumber">
                      <Form.Label>Restaurant Registration Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        isInvalid={!!errors.registrationNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.registrationNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formStreet">
                      <Form.Label>Street</Form.Label>
                      <Form.Control
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        isInvalid={!!errors.street}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formProvince">
                      <Form.Label>Province</Form.Label>
                      <Form.Control
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        isInvalid={!!errors.province}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.province}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formZipcode">
                      <Form.Label>Zipcode</Form.Label>
                      <Form.Control
                        type="text"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        isInvalid={!!errors.zipcode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zipcode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
                <Button variant="primary" type="submit" className="btn-block">
                  Sign Up
                </Button>
              </Form>
            )}
            <div className="text-center mt-3">
              {loading && <p>Loading...</p>}
              {error && (
                <p className="text-danger">Error signing up: {error.message}</p>
              )}
              {data && (
                <p className="text-success">
                  Sign up successful: {data.signup.username}
                </p>
              )}
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
};
export default Signup;
