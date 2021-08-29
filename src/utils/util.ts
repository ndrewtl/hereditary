/*
 * This file houses miscellaneous utility functions
 * Over time, as more functions are added, natural classifications of these functions should
 * arrive and they should be decomposed into more specific files.
 */

import { Force } from 'd3';
import { Person, PersonLink, DataSchema } from './types';
import { load } from 'js-yaml';

/**
 * This is a force that causes nodes to gravitate toward the correct time
 * When affected by this force, a Person 'falls' toward the height that (proportionally)
 * represents the year of their birth
 * @param {number} height - the height of the viewBox
 * @param {strength} strength - the strength of the force
 * @return {Force<Person, PersonLink>} a force that causes each person to be attracted
 * along the y-axis toward the year of their birth
 */
export function ageOrdering(height: number, strength: number = 0.1): Force<Person, PersonLink> {
  let nodes: Person[],
    earliestYear: number,
    latestYear: number;

  const force = (alpha: number) => {
    nodes.forEach(node => {
      // How far along the y-axis the node should be, on a scale of 0-1
      const proportion = (node.born - earliestYear)/(latestYear - earliestYear);
      // Now scale that proportion to an absolute position based on height
      const position = proportion * height;
      // Now, set the velocity toward the position, based on current position, alpha, and strength
      node.vy! += (position - node.y!) * alpha * strength;
    });
  };

  force.initialize = (inputNodes: Person[]) => {
    nodes = inputNodes;
    // The earliest year is the earliest birth date of a monarch, with 100 years' padding
    earliestYear = Math.min(...nodes.map((node) => node.born)) - 100;
    // The latest year is the latest birth date of a monarch, with 100 years' padding
    latestYear = Math.max(...nodes.map((node) => node.born)) + 100;
  };

  force.strength = (newVal: number) => {
    strength = newVal;
  };

  return force;
}

/**
 * An async function that fetches and returns data for the simulation
 * @param {string} url - the url from which to fetch the data
 * @return {Promise<DataSchema>} - the data
 */
export async function fetchData(url: string = '/data.yml'): Promise<DataSchema> {
  const response = await fetch(url);
  const text = await response.text();
  return await load(text) as DataSchema;
}

