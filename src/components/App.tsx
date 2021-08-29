import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tree from './Tree';
import { Async } from 'react-async';
import { fetchData } from '../utils/util';
import { DataSchema } from '../utils/types';

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
              <Tree width={800} height={800} radius={30} data={data} />
            }
          </Async.Fulfilled>
        </Async>
      </Row>
    </Container>
  );
}

export default App;
