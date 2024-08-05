import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "./UserContext";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      role
      profilePic
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const signupSuccess = queryParams.get("signup") === "success";
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setErrorMessage("Username is required");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    try {
      const result = await login({ variables: { username, password } });
      const user = result.data.login;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
      if (user.role === "Merchant") navigate(`/merchantdashboard`);
      else if (user.role === "Admin") navigate("/admin/");
      else navigate("/food");
    } catch (e) {
      setErrorMessage(e.message);
      toast.error("Error during login: " + e.message);
      console.error("Error during login:", e.message);
    }
  };

  return (
    <Container className="mt-5 mb-4">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Login</h2>

              {signupSuccess && (
                <Alert variant="success" className="text-center">
                  Signup successful! Please log in.
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="danger" className="text-center">
                  {errorMessage}
                </Alert>
              )}
              <Form onSubmit={handleSubmit} className="form-login">
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
                <Button variant="primary" type="submit" className="btn-block mt-4" disabled={loading}>
                  {loading ? 'Processing...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
