import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { DataSchema, Config } from '../utils/types';
import { uniq } from 'lodash';

interface ConfigEditorProps {
  data: DataSchema;
  config: Config;
  submitConfig: (config: Config) => void;
}
function ConfigEditor({ data: { people }, config, submitConfig }: ConfigEditorProps) {
  // The list of all countries, derived from the data
  const countryList = useMemo(() =>
    uniq(people.map(person => person.country)).sort(),
    [people]);

  // The config, as currently maintained inside this form
  const [countries, setCountries] = useState(config.countries);
  const [before, setBefore] = useState(config.before);
  const [since, setSince] = useState(config.since);

  return (
    <Row>
      <Col>
        <Form.Label>Countries</Form.Label>
        {countryList.map(country =>
          // For each country, show a checkbox for whether that country is included or not
          <Form.Check
            type='checkbox'
            key={`${country}-enabled`}
            id={`${country}-enabled`}
            label={country}
            checked={countries.has(country)}
            onChange={() => {
              if (countries.has(country)) {
                countries.delete(country);
              } else {
                countries.add(country);
              }
              setCountries(new Set(countries));
            }}
          />
        )}
      </Col>

      <Col>
        <Row>
          <Form.Label>Dates</Form.Label>
          <Col>
            <Form.Label>Since</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type='number'
                value={since}
                onChange={event => setSince(
                  event.target.value ?
                  Number(event.target.value) : undefined
                )}
              />
              <InputGroup.Text>CE</InputGroup.Text>
            </InputGroup>
          </Col>
          <Col>
            <Form.Label>Before</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type='number'
                value={before}
                onChange={event => setBefore(
                  event.target.value ?
                  Number(event.target.value) : undefined
                )}
              />
              <InputGroup.Text>CE</InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      </Col>

      <Button
        variant='primary'
        type='submit'
        onClick={() =>
          // Then submit the configuration based on current form state
          submitConfig({
            ...config,
            countries: countries,
            before: before,
            since: since
          })
        }
      >Apply</Button>
    </Row>
  );
}

export default ConfigEditor;
