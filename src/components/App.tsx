import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tree from './Tree';
import Navigation from './Navigation';
import ConfigEditor from './ConfigEditor';
import { Async } from 'react-async';
import { fetchData } from '../utils/util';
import { DataSchema, Config } from '../utils/types';
import { join } from 'path';

const defaultConfig: Config = {
  width: 800,
  height: 800,
  radius: 30,
  countries: new Set([
    'United Kingdom',
    'Spain',
    'German Empire'
  ]),
  before: 1985,
  since: 1800
}

function App() {
  const [config, setConfig] = useState(defaultConfig);

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <hr />
        </Row>
          <Async promiseFn={() => fetchData(join(process.env.PUBLIC_URL, 'data.yml'))} >
            <Async.Fulfilled>
              {(data: DataSchema) =>
              <>
                <Row>
                  <Accordion style={{marginBottom: '5px'}} defaultActiveKey='0'>
                    <Accordion.Item eventKey='0'>
                      <Accordion.Header>Options</Accordion.Header>
                      <Accordion.Body>
                        <ConfigEditor data={data} config={config} submitConfig={setConfig} />
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
    </>
  );
}

export default App;
