import React from 'react'
import { Button, Container, Image, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import img from "../../assets/img/marketplace.png";

import { useNavigate } from 'react-router-dom'

export const PublicNavbar = () => {
    const navigation = useNavigate();

    const handleLogin =() =>{
        navigation("/auth")
    }
  return (
    <Navbar bg="dark" variant="dark">
    <Container fluid>
      <Navbar.Brand href="#">
      <Image src={img} style={{ width: 20, height: "auto" }} />
      </Navbar.Brand>
      <Nav className="me-auto">
        <Link to={"/"} className="nav-link">
          Productos
        </Link>
        <Link to={"/contact"} className="nav-link">
          Contacto
        </Link>
       
      </Nav>
      <Button variant="outline-light" onClick={handleLogin}>Iniciar sesion</Button>
    </Container>
  </Navbar>
  )
}
