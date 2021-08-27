import React, { useEffect } from 'react';
import { select, create, drag } from 'd3';
import { forceSimulation, forceLink, forceManyBody, forceCenter, SimulationLinkDatum } from 'd3-force';
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

interface PeopleYAML {
  people: [Person];
}
type Identifier = string
interface Person {
  id: Identifier;
  mother?: Identifier;
  father?: Identifier;
}

const chart = ({ people }: PeopleYAML) => {

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

  const width = 500;
  const height = 500;
  const svg = create('svg')
  .attr('viewBox', `0 0 ${width} ${height}`)

  const simulation = forceSimulation(nodes)
    .force('charge', forceManyBody())
  // @ts-ignore
    .force('link', forceLink(links).id(d => d.id));

  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 10);

  const color = '#ff0000';

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", color)
  // @ts-ignore
    .call(dg(simulation));

  node
    .append('title')
    .text(d => d.name);

  simulation.on("tick", () => {
    link
    // @ts-ignore
        .attr("x1", d => d.source.x)
    // @ts-ignore
        .attr("y1", d => d.source.y)
    // @ts-ignore
        .attr("x2", d => d.target.x)
    // @ts-ignore
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  return svg.node();
}

async function fetchData(): Promise<PeopleYAML> {
  const response = await fetch('/people.yml')
  const text = await response.text();
  return await load(text) as PeopleYAML;
}

export default () => {
  const id = 'tree';

  useEffect(() => {
    fetchData()
      .then(data =>
        select(`#${id}`)
        .append(() => chart(data)));
  }, []);
  return (
    <div style={{ border: '1px solid black' }} id={id}>
    </div>
  );
}
