import React from "react";
import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/chat.png";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../services/appApi";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout(e) {
    e.preventDefault();

    await logoutUser(user);

    // redirect to homepage
    window.location.replace("/");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <LinkContainer to="/">
            <img src={logo} width={50} height={50} alt="logo" />
          </LinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <h3>Chat App</h3>
            </LinkContainer>
          </Nav>

          <Nav className="ms-auto">
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}

            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>

            {user && (
              <NavDropdown
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      alt=""
                    />
                    {user.userName}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
