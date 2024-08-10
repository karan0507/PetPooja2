import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import defaultProfilePic from "../Assests/Images/default.png";
import { useUser } from "./UserContext";  

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  const profilePicUrl = user && user.profilePic ? user.profilePic : defaultProfilePic;

  return (
    <Navbar bg="dark" variant="dark" className="p-0" expand="lg">
      <Container className="mt-0 p-2">
        <Navbar.Brand as={Link} to="/" className="me-auto">
          PetPooja
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="text-white">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            {user && user.role === "Customer" && (
              <>
              <Nav.Link as={Link} to="/food">
                Food
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/order-history">
                Order
              </Nav.Link>
              </>
            )}
            {user && user.role === "Admin" && (
              <Nav.Link as={Link} to="/admin">
                Admin
              </Nav.Link>
            )}
            {user && (user.role === "Customer" || user.role === "Merchant") && (
              <Nav.Link as={Link} to={`/profile/${user.id}`}>
                Profile
              </Nav.Link>
              
            )}
             {user && user.role === "Merchant" && (
              <>
              
                <Nav.Link as={Link} to="/merchantdashboard">
                  Dashboard
                </Nav.Link>
                
              </>
            )}
          </Nav>
          <Nav className="ml-auto d-flex align-items-center">
            {user ? (
              <>
             
                <Nav.Link className="text-light" disabled>
                <Image
                  src={profilePicUrl}
                  roundedCircle
                  width="20"
                  height="20"
                  className="me-2"
                  alt="Profile"
                /><b>{user.username}</b> 
                </Nav.Link>
                <Nav.Link className="text-warning" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link className="text-info" as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
