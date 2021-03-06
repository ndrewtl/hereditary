import React, { useEffect, useState, useMemo } from 'react';
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
import { ageOrdering } from '../utils/util';
import { join } from 'path';

interface PersonSVGProps {
  person: Person;
  radius: number;
  reignColors: Record<Reign, Color>;
}
function PersonSVG({ person, radius, reignColors }: PersonSVGProps) {
  const {
    name, country, reign, x, y
  } = person;
  const id = useMemo(() => name.replaceAll(/\s+/g, '_'), []);

  return (
    <g>
      <clipPath id={`${id}-mask`}>
        <circle r={radius} cx={x!} cy={y!} />
      </clipPath>
      <image
        key={id}
        href={join(process.env.PUBLIC_URL, `flags/${country}.svg`)}
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
        strokeWidth='4px'
        fillOpacity='0'
        id={id}
      />
      <text
        x={x}
        y={y! - (1.2 * radius)}
        textAnchor='middle'
        stroke='#fff'
        strokeWidth='0.5'
        strokeOpacity='0.6'
        fill='#000'
        fontSize='16px'
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
      stroke='#999'
      strokeOpacity='0.6'
      strokeWidth='10'
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
  config: { width, height, radius, countries, before, since }
}: TreeProps) {
  const [simulation] = useState(forceSimulation<Person>().stop());
  // Have nodes and links be state variables so we can update them
  const [nodes, setNodes] = useState<Person[]>([]);
  const [links, setLinks] = useState<PersonLink[]>([]);

  // The drag state is two offsets and the person being dragged, or null
  const [drag, setDrag] = useState<[number, number, Person] | null >(null);

  useEffect(() => {
    // We only make selectedPeople mutable because we will re-set it several times in the
    // subsequent wave of filters
    let selectedPeople = people;
    if (before) {
      // If before is defined, only include people born up to (and including) the date
      selectedPeople = selectedPeople.filter(person => person.born <= before);
    }
    if (since) {
      // If since is defined, only include people born since the date
      selectedPeople = selectedPeople.filter(person => person.born >= since);
    }
    selectedPeople = selectedPeople
      // Include the selected countries
      .filter(person => countries.has(person.country));
    const computedLinks = flatMap(selectedPeople, (person: Person) => {
      // Initialize links as familial connections
      // TODO other kinds of links, such as succession
      const result = [];
      // If the person has a defined mother and that mother can be found in selectedPeople...
      if (person.mother && selectedPeople.find(p=>p.name == person.mother)) {
        // Add a link between that person and their mother
        result.push({
          source: person.name,
          target: person.mother
        });
      }

      // And do the same with father
      if (person.father && selectedPeople.find(p=>p.name == person.father)) {
        result.push({
          source: person.name,
          target: person.father
        });
      }

      return result;
    });

    // One-time initialization: add simulation nodes and forces
    simulation.nodes(selectedPeople);
    simulation
      .force('charge', forceManyBody().strength(-2000))
      .force('link', forceLink<Person, PersonLink>(computedLinks).id((d) => d.name).strength(0.2))
      .force('age', ageOrdering(height, 1))
      .force('horizontal-center', forceX(width / 2).strength(0.25));
    simulation.alphaTarget(0.0).restart();

    // Set the initial nodes and links
    setNodes(selectedPeople);
    setLinks(computedLinks);
  }, [countries]);

  // On every simulation step, write nodes and links again
  simulation.on('tick', () => {
    setNodes([...nodes]);
    setLinks([...links]);
  });

  return (
    <svg
      width={width}
      height={height}
      style={{
        border: '1px solid black'
      }}
      viewBox={`0 0 ${width} ${height}`}
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
          simulation.alphaTarget(0);
        }
      }}
      onMouseLeave={() => {
        if (drag) {
          const [, , person] = drag;
          person.fx = person.fy = null;
          setDrag(null);
          simulation.alphaTarget(0);
        }
      }}
    >
      <g>
        {links.map((link) =>
        <g key={`link-${(link.source as Person).name}-${(link.target as Person).name}`}>
          <PersonLinkSVG link={link} />)
        </g>)}
      </g>
      <g>
        {nodes.map((node) => (
          <g
            onMouseDown={(e) => {
              setDrag([node.x! - e.clientX, node.y! - e.clientY, node]);
              simulation.alphaTarget(0.3).restart();
            }}
            cursor='move'
            key={`${node.name}-node`}
          >
            <PersonSVG person={node} radius={radius} reignColors={colors!.reign} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default Tree;
