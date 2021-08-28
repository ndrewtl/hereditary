import React, { useEffect } from 'react';
import {
  select,
  create,
  drag
} from 'd3';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  Force,
  forceX,
  SimulationNodeDatum,
  SimulationLinkDatum
} from 'd3-force';
import { load } from 'js-yaml';
import { flatMap } from 'lodash';

const dg = (simulation:any) => {

  function dragstarted(event:any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event:any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event:any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

type Color = string;
type Country = string;
interface Data {
  people: [Person];
  colors: {
    countries: Record<Country, Color>;
    reign: Record<Reign, Color>;
  }
};

enum Reign {
    Current = 'current',
    Past = 'past',
    None = 'none',
    Expected = 'expected'
}

type Identifier = string;
interface Person extends SimulationNodeDatum {
  id: Identifier;
  mother?: Identifier;
  father?: Identifier;
  country?: Country;
  born: number;
  reign?: Reign;
};
type Link = SimulationLinkDatum<Person>;

export function ageOrdering(height: number, strength: number = 0.1): Force<Person, Link> {
  let nodes: [Person],
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

  force.initialize = (inputNodes: [Person]) => {
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

const chart = ({ people, colors }: Data, width = 600, height = 800) => {

  const radius = 20;

  const nodes = people.map(person => Object.create(person));

  const links = flatMap(people, (person: Person) => {
    const result = [];
    if (person.mother) {
      result.push({
        source: person.id,
        target: person.mother
      });
    }

    if (person.father) {
      result.push({
        source: person.id,
        target: person.father
      });
    }

    return result;
  });

  const svg = create('svg').attr('viewBox', `0 0 ${width} ${height}`)

  const simulation = forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-300))
    .force('link', forceLink<Person, Link>(links).id(d => d.id).strength(0.05))
    .force('age', ageOrdering(height, 0.1))
    .force('horizontal-center', forceX(width / 2).strength(0.05));

  const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 10);

  const container = svg.append("g")

  const masks = container
    .selectAll('clipPath')
    .data(nodes)
    .join('clipPath')
    .attr('id', d => `${d.id}-mask`)
    .append('circle')
    .attr('r', radius)
  .attr('stroke', '#000')

  const flags = container
    .selectAll()
    .data(nodes)
    .join('image')
    .attr('href', d => `/flags/${d.country}.svg`)
    .attr('height', radius * 2)
    .attr('clip-path', d => `url(#${d.id}-mask)`)

  const outlines = container
    .selectAll()
    .data(nodes)
    .join('circle')
    .attr('r', radius)
    .attr('stroke', (d: Person) => d.reign ? colors.reign[d.reign] : colors.reign.none)
    .attr('stroke-width', '4px')
    .attr('fill-opacity' , 0)
  // @ts-ignore
    .call(dg(simulation));

  const text = container
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.name)
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .attr('stroke-opacity', 0.6)
    .attr('fill', '#000')
    .attr('font-size', '16px')


  simulation.on("tick", () => {
    link
    // @ts-expect-error
        .attr("x1", d => d.source.x)
    // @ts-expect-error
        .attr("y1", d => d.source.y)
    // @ts-expect-error
        .attr("x2", d => d.target.x)
    // @ts-expect-error
        .attr("y2", d => d.target.y);

    flags
        .attr("x", d => d.x - 2 * radius)
        .attr("y", d => d.y - radius);
    text
      .attr('x', d => d.x - radius)
      .attr('y', d => d.y - radius)
    masks
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    outlines
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  });

  return svg.node();
}

async function fetchData(): Promise<Data> {
  const response = await fetch('/data.yml')
  const text = await response.text();
  return await load(text) as Data;
}

export default () => {
  const id = 'tree';

  useEffect(() => {
    ((async () => {
      const data = await fetchData();
        select(`#${id}`)
      .append(() => chart(data));
    })());
  }, []);
  return (
    <div style={{ border: '1px solid black' }} id={id}>
    </div>
  );
}
