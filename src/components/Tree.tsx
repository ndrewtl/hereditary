import React, { useEffect, useState, useMemo } from 'react';
import {
  select,
  create,
} from 'd3';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  Force,
  forceX
} from 'd3-force';
import { load } from 'js-yaml';
import { flatMap } from 'lodash';
import { drag } from '../utils/drag';
import {
  Person, PersonLink, DataSchema, Reign, Color, Colors
} from '../utils/types';

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

const chart = ({ people, colors }: DataSchema, width = 600, height = 800) => {

  const radius = 20;
  const nodes = people;

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
    .force('link', forceLink<Person, PersonLink>(links).id(d => d.id).strength(0.05))
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
    .call(drag(simulation));

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
        .attr("x", d => d.x! - 2 * radius)
        .attr("y", d => d.y! - radius);
    text
      .attr('x', d => d.x! - radius)
      .attr('y', d => d.y! - radius)
    masks
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
    outlines
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
  });

  return svg.node();
}

async function fetchData(): Promise<DataSchema> {
  const response = await fetch('/data.yml')
  const text = await response.text();
  return await load(text) as DataSchema;
}

interface PersonSVGProps {
  person: Person;
  radius: number;
  reignColors: Record<Reign, Color>
}
function PersonSVG({ person: { id, name, country, reign, x, y}, radius, reignColors}: PersonSVGProps) {
          return (<g>
            <clipPath id={`${id}-mask`}>
              <circle r={radius} cx={x!} cy={y!} />
            </clipPath>
            <image key={id}
                   href={`/flags/${country!}.svg`}
                   x={x! - 2*radius}
                   y={y! - radius}
                   height={radius * 2}
                   clipPath={`url(#${id}-mask)`} />
            <circle r={radius}
                    cx={x!}
                    cy={y!}
                    stroke={reign ? reignColors[reign] : reignColors.none}
                    strokeWidth='4px'
                    fillOpacity='0'
            />
            <text x={x! - (1.2 * radius)}
                  y={y! - (1.2 * radius)}
                  stroke='#fff'
                  strokeWidth='0.5'
                  strokeOpacity='0.6'
                  fill='#000'
                  fontSize='16px'
            >{name}</text>
          </g>);
}

interface PersonLinkSVGProps {
  link: PersonLink;
}
function PersonLinkSVG({ link }: PersonLinkSVGProps) {
  return (
    <line x1={(link.source as Person).x}
          y1={(link.source as Person).y}
          x2={(link.target as Person).x}
          y2={(link.target as Person).y}
          stroke='#999'
          strokeOpacity='0.6'
          strokeWidth='10' />
  );
}

interface TreeProps {
  width: number;
  height: number;
  radius: number;
}
function Tree({width, height, radius}: TreeProps) {

  const [simulation, ] = useState(forceSimulation().stop());
  const [colors, setColors] = useState<Colors>();
  const [nodes, setNodes] = useState<Person[]>([]);
  const [links, setLinks] = useState<PersonLink[]>([]);

  useEffect(() => {
    fetchData().then(({ people, colors }) => {
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
      setColors(colors);
      setNodes(people);
      setLinks(links);

      simulation.nodes(people);
      simulation
        .force('charge', forceManyBody().strength(-300))
        .force('link', forceLink<Person, PersonLink>(links).id(d => d.id).strength(0.05))
        .force('age', ageOrdering(height, 0.1))
        .force('horizontal-center', forceX(width / 2).strength(0.05));
      simulation.alphaTarget(0.3).restart();
    })
  }, []);

  simulation.on('tick', () => {
    console.log(simulation.alpha());
    setNodes([...nodes]);
    setLinks([...links]);
  });

  return (
    <svg width={width} height={height}>
      <g>
        {links.map(link =>
          <PersonLinkSVG link={link} />
        )}
      </g>
      <g>
        {nodes.map(node =>
          <PersonSVG person={node} radius={radius} reignColors={colors!.reign}/>
        )}
      </g>
    </svg>
  );
}

export default Tree;
