import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./header.scss";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";

const Header = () => {
  const authState = useSelector((state) => state.auth);

  return (
    <>
      <header>
        <Navbar bg="dark" data-bs-theme="dark" style={{ width: "100%" }}>
          <Container>
            <NavLink
              to="/"
              className="text-decoration-none text-light mx-2"
              style={{ fontSize: "20px" }}
            >
              RecipeEasy
            </NavLink>
            <Nav className="me-auto">
              <NavLink to="/" className="text-decoration-none text-light mx-2">
                Home
              </NavLink>
              {authState.auth && (
                <NavLink
                  to="/create"
                  className="text-decoration-none text-light mx-2"
                >
                  Create Recipe
                </NavLink>
              )}
            </Nav>
            <Nav className="text-end">
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  className="dropdown_btn"
                  id="dropdown-basic"
                >
                  <div
                    style={{ width: "45px", height: "45px", cursor: "pointer" }}
                  >
                    <img
                      src={
                        authState.data
                          ? authState.data.userprofile || "/user.png"
                          : "/user.png"
                      }
                      alt="User icon"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {authState.auth ? (
                    <>
                      <div>
                        <NavLink
                          to="/profile"
                          className="text-decoration-none text-light mx-2"
                        >
                          Profile
                        </NavLink>
                      </div>
                      <br />
                      <div>
                        <NavLink
                          to="/logout"
                          className="text-decoration-none text-light mx-2"
                        >
                          Sign Out
                        </NavLink>
                      </div>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="text-decoration-none text-light mx-2"
                      >
                        Login
                      </NavLink>

                      <div style={{marginTop: "10px"}}>
                      <NavLink to="/register" className="text-decoration-none text-light mx-2">
                      Sign Up
                    </NavLink>
                      </div>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
