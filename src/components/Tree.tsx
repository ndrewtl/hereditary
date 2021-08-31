import React, { useEffect, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX
} from 'd3-force';
import { flatMap } from 'lodash';
import {
  Person, PersonLink, Reign, Color, Config, DataSchema
} from '../utils/types';
import { ageOrdering, fetchData } from '../utils/util';

interface PersonSVGProps {
  person: Person;
  radius: number;
  reignColors: Record<Reign, Color>;
}
function PersonSVG({ person, radius, reignColors }: PersonSVGProps) {
  const {
    id, name, country, reign, x, y
  } = person;

  return (
    <g>
      <clipPath id={`${id}-mask`}>
        <circle r={radius} cx={x!} cy={y!} />
      </clipPath>
      <image
        key={id}
        href={`/flags/${country!}.svg`}
        x={x! - 2 * radius}
        y={y! - radius}
        height={radius * 2}
        clipPath={`url(#${id}-mask)`}
      />
      <circle
        r={radius}
        cx={x!}
        cy={y!}
        stroke={reign ? reignColors[reign] : reignColors.none}
        strokeWidth="4px"
        fillOpacity="0"
        id={id}
      />
      <text
        x={x}
        y={y! - (1.2 * radius)}
        textAnchor="middle"
        stroke="#fff"
        strokeWidth="0.5"
        strokeOpacity="0.6"
        fill="#000"
        fontSize="16px"
      >
        {name}
      </text>
    </g>
  );
}

interface PersonLinkSVGProps {
  link: PersonLink;
}
function PersonLinkSVG({ link }: PersonLinkSVGProps) {
  return (
    <line
      x1={(link.source as Person).x}
      y1={(link.source as Person).y}
      x2={(link.target as Person).x}
      y2={(link.target as Person).y}
      stroke="#999"
      strokeOpacity="0.6"
      strokeWidth="10"
    />
  );
}

interface TreeProps {
  // TODO have this be nodes instead
  data: DataSchema;
  config: Config;
}
function Tree({
  data: { people, colors },
  config: { width, height, radius }
}: TreeProps) {
  const [simulation] = useState(forceSimulation<Person>().stop());
  // Have nodes and links be state variables so we can update them
  const [nodes, setNodes] = useState<Person[]>([]);
  const [links, setLinks] = useState<PersonLink[]>([]);

  useEffect(() => {
    // One-time initialization: add simulation nodes and forces
      simulation.nodes(people);
      simulation
        .force('charge', forceManyBody().strength(-300))
        .force('link', forceLink<Person, PersonLink>(links).id((d) => d.id).strength(0.05))
        .force('age', ageOrdering(height, 0.1))
        .force('horizontal-center', forceX(width / 2).strength(0.05));
      simulation.alphaTarget(0.3).restart();

    // Set initial nodes and links:
    setNodes(simulation.nodes());
    setLinks(flatMap(nodes, (person: Person) => {
      // Initialize links as familial connections
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
    }));
  }, []);

  // On every simulation step, write nodes and links again
  simulation.on('tick', () => {
    setNodes([...nodes]);
    setLinks([...links]);
  });

  const [drag, setDrag] = useState<[number, number, Person] | null >(null);

  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid black' }}
      onMouseMove={(e) => {
        if (drag) {
          const [offsetX, offsetY, person] = drag;
        person.fx! = e.clientX + offsetX;
        person.fy! = e.clientY + offsetY;
        }
      }}
      onMouseUp={() => {
        if (drag) {
          const [, , person] = drag;
          person.fx = person.fy = null;
          setDrag(null);
        }
      }}
      onMouseLeave={() => {
        if (drag) {
          const [, , person] = drag;
          person.fx = person.fy = null;
          setDrag(null);
        }
      }}
    >
      <g>
        {links.map((link) =>
        <g key={`${(link.source as Person).id}-link`}>
          <PersonLinkSVG link={link} />)
        </g>)}
      </g>
      <g>
        {nodes.map((node) => (
          <g
            onMouseDown={(e) => {
              setDrag([node.x! - e.clientX, node.y! - e.clientY, node]);
            }}
            cursor="move"
            key={`${node.id}-node`}
          >
            <PersonSVG person={node} radius={radius} reignColors={colors!.reign} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default Tree;
