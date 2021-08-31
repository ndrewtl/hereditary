import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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
    uniq(people.map(person => person.country!)).sort(),
    [people]);

  // The config, as currently maintained inside this form
  const [countries, setCountries] = useState(config.countries);

  return (
    <Form onSubmit={(event) => {
      // On form submit, prevent normal form behavior
      event.preventDefault();
      // Then submit the configuration based on current form state
      submitConfig({
        ...config,
        countries: countries
      });
    }}>
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

      <Button variant='primary' type='submit'>Apply</Button>
    </Form>
  );
}

export default ConfigEditor;
