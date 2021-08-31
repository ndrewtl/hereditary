import React, { useMemo } from 'react';
import Form from 'react-bootstrap/Form';
import { DataSchema, Config } from '../utils/types';
import { uniq } from 'lodash';

interface ConfigEditorProps {
  data: DataSchema;
  config: Config;
}
function ConfigEditor({ data: { people } }: ConfigEditorProps) {
  const countries = useMemo(() =>
    uniq(people.map(person => person.country!)).sort(),
    [people]);

  return (
    <Form>
      <Form.Label>Countries</Form.Label>
      {countries.map(country =>
        <Form.Check type='checkbox' key={`${country}-enabled`} id={`${country}-enabled`} label={country}/>
      )}
    </Form>
  );
}

export default ConfigEditor;
