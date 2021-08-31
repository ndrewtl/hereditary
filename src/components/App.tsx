import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tree from './Tree';
import { Async } from 'react-async';
import { fetchData } from '../utils/util';
import { DataSchema, Config } from '../utils/types';

const defaultConfig: Config = {
  width: 800,
  height: 800,
  radius: 30
}

function App() {
  return (
    <Container>
      <Row>
        <h1>Hereditary</h1>
        <hr />
      </Row>
      <Row>
        <Async promiseFn={() => fetchData()} >
          <Async.Fulfilled>
            {(data: DataSchema) =>
              <Tree data={data} config={defaultConfig} />
            }
          </Async.Fulfilled>
          <Async.Loading>Loading data...</Async.Loading>
        </Async>
      </Row>
    </Container>
  );
}

export default App;
