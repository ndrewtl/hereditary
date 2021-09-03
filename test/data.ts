import test from 'ava';
import { load } from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import { DataSchema } from '../src/utils/types';

// Initialize data as loaded from the data file
let data: DataSchema;
test.before(async () => {
  data = await load(readFileSync('public/data.yml', 'utf8')) as DataSchema;
})

test('All parents exist and all children are younger than parents', t => {
  const { people } = data;
  people.forEach(person => {
    if (person.mother) {
      const mother = people.find(candidate => candidate.name === person.mother);
      t.assert(mother, `${person.name} has existent mother ${person.mother}`);
      if (mother) { t.assert(person.born > mother.born, `${person.name} is younger than mother ${mother.name}`); }
    }
    if (person.father) {
      const father = people.find(candidate => candidate.name === person.father);
      t.assert(father, `${person.name} has existent father ${person.father}`);
      if (father) { t.assert(person.born > father.born, `${person.name} is younger than father ${father.name}`); }
    }
  });
});

test('All countries have flags', t => {
  const { people } = data;
  const countries = new Set(
    people.map(person => person.country)
  );

  countries.forEach(country =>
    t.assert(existsSync(`public/flags/${country}.svg`))
  );
});
