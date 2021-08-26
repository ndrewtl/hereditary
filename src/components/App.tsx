import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tree from './Tree';

function App() {
  return (
    <Container>
      <Row>
        <h1>Hereditary</h1>
        <hr />
      </Row>
      <Row>
        <Tree />
      </Row>
    </Container>
  );
}

export default App;
