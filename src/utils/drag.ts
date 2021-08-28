import { drag as d3Drag, Simulation, SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export function drag<Node extends SimulationNodeDatum, Link extends SimulationLinkDatum<Node>>(
    simulation: Simulation<Node, Link>
) {
  // From https://observablehq.com/@d3/force-directed-graph
  return d3Drag()
      .on("start", (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.x;
        event.subject.fx = event.x;
      })
      .on("drag", (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event: any) => {
        event.subject.fx = null;
        event.subject.fy = null;
      });
}
