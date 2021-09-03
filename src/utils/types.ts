import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

/**
 * The ID for a person
 */
export type Identifier = string;

/**
 * Colors, used for styling
 */
export type Color = string;

/**
 * The country from which someone hails
 */
export type Country = string;

/**
 * A person can be
 * - the current monarch
 * - a previously-reigning monarch
 * - not a monarch, or
 * - expected to rule
 */
export enum Reign {
    Current = 'current',
    Past = 'past',
    None = 'none',
    Expected = 'expected'
}

/**
 * A person is a SimulationNodeDatum with the attributes of a person
 */
export interface Person extends SimulationNodeDatum {
  name: string;
  mother?: Identifier;
  father?: Identifier;
  country: Country;
  born: number;
  reign?: Reign;
}

/**
 * A link between people
 */
export type PersonLink = SimulationLinkDatum<Person>;

/**
 * An object describing the colors, or theming of the tree
 */
export interface Colors {
  countries: Record<Country, Color>;
  reign: Record<Reign, Color>;
}

/**
 * One final type: this is the schema for the /public/data.yml file and is used for importing it
 */
export interface DataSchema {
  people: Person[];
  colors: Colors;
}

/**
 * Configuration for the tree
 */

export interface Config {
  countries: Set<Country>;
  width: number;
  height: number;
  radius: number;
  since?: number;
  before?: number;
}
