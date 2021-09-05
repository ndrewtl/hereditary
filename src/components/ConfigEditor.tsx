import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { DataSchema, Config, Country } from '../utils/types';
import { uniq } from 'lodash';
import { join } from 'path';

interface ConfigEditorProps {
  data: DataSchema;
  config: Config;
  submitConfig: (config: Config) => void;
}

interface CountriesEditorProps {
  // The list of all countries in the dataset
  countryList: Country[];
  // The set of selected countries
  selectedCountries: Set<Country>;
  // The selectedCountires setter function
  setSelectedCountries: (countries: Set<Country>) => void;
}
function CountriesEditor({
  countryList,
  selectedCountries,
  setSelectedCountries
}: CountriesEditorProps) {
  return (
    <Row>
      <Form.Label>Countries</Form.Label>
      {countryList.map(country =>
        // For each country, show a checkbox for whether that country is included or not
        <Form.Check
          type='checkbox'
          key={`${country}-enabled`}
          id={`${country}-enabled`}
          label={country}
          checked={selectedCountries.has(country)}
          onChange={() => {
            if (selectedCountries.has(country)) {
              selectedCountries.delete(country);
            } else {
              selectedCountries.add(country);
            }
            setSelectedCountries(new Set(selectedCountries));
          }}
        />
      )}
    </Row>
  )
}

interface DatesEditor {
  before: number | undefined;
  since: number | undefined;
  setBefore: (before: number | undefined) => void;
  setSince: (since: number | undefined) => void;
}
function DatesEditor({
  before,
  since,
  setBefore,
  setSince
}: DatesEditor) {
  return (
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
  );
}

function ConfigEditor({ data: { people }, config, submitConfig }: ConfigEditorProps) {
  // The list of all countries, derived from the data
  const countryList = useMemo(() =>
    uniq(people.map(person => person.country)).sort(),
    [people]);

  // The config, as currently maintained inside this form
  const [selectedCountries, setSelectedCountries] = useState(config.countries);
  const [before, setBefore] = useState(config.before);
  const [since, setSince] = useState(config.since);

  return (
    <>
      <Row>
        <Col>
          <CountriesEditor
            countryList={countryList}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
          />
        </Col>
        <Col>
          <DatesEditor
            before={before}
            since={since}
            setBefore={setBefore}
            setSince={setSince}
          />
        </Col>
        <Button
          variant='primary'
          type='submit'
          onClick={() =>
            // Then submit the configuration based on current form state
            submitConfig({
              ...config,
              countries: selectedCountries,
              before: before,
              since: since
            })
          }
        >Apply</Button>
      </Row>
    </>
  );
}

export default ConfigEditor;
