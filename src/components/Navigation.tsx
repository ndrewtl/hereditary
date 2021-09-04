import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { repository } from '../../package.json';
import { join } from 'path';

export default function Navigation() {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href='/hereditary'>Hereditary</Navbar.Brand>
        <Nav>
          <Nav.Link href={repository}>GitHub</Nav.Link>
          <Nav.Link href={join(repository, 'issues/new')}>File an Issue</Nav.Link>
          <Nav.Link href={join(repository, 'edit/main/public/data.yml')}>Contribute Data</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
