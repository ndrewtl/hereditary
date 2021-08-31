import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tree from './Tree';
import ConfigEditor from './ConfigEditor';
import { Async } from 'react-async';
import { fetchData } from '../utils/util';
import { DataSchema, Config } from '../utils/types';

const defaultConfig: Config = {
  width: 800,
  height: 800,
  radius: 30
}

function App() {
  const [config, setConfig] = useState(defaultConfig);

  return (
    <Container>
      <Row>
        <h1>Hereditary</h1>
        <hr />
      </Row>
        <Async promiseFn={() => fetchData()} >
          <Async.Fulfilled>
            {(data: DataSchema) =>
            <>
              <Row>
                <Accordion style={{marginBottom: '5px'}}>
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>Options</Accordion.Header>
                    <Accordion.Body>
                      <ConfigEditor data={data} config={config} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Row>
              <Row>
                <Tree data={data} config={config} />
              </Row>
            </>
            }
          </Async.Fulfilled>
          <Async.Loading>Loading data...</Async.Loading>
        </Async>
    </Container>
  );
}

export default App;
