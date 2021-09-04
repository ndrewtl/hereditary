# Hereditary

An interactive visualization of the royal families of various countries.

The family tree is represented as a [d3-force](https://github.com/d3/d3-force)
graph simulation where each node is a person, and an edge connecting two nodes
indicates that one is a child of the other. The simulation has the following rules:

- All nodes repel each other
- Parental relations draw nodes together
- Nodes are vertically drawn toward the year of their birth. This is calculated
as follows:
  - Say that the oldest person was born in 1900 and the youngest person was born
  in 2000. Say person _x_ is born in 1980.
  - Then the age-sorting force:
    - attracts the oldest person near to the top of the simulation
    - attracts the youngest near to the bottom of the simulation
    - attracts person _x_ about 80% of the way down in the simulation
  - The effect of this is that each person 'falls' toward their birth year,
  sorting the tree by age
- All nodes are (mildly) attracted toward the vertical centerline of the simulation.
This has the effect of preventing nodes from floating outside of the image left
or right.

The simulation will begin as a jumble and will sort itself, producing a family
tree. However, sometimes nodes will become a bit 'tangled up'. If the node seems
stuck or contorted, you can help it out by dragging some of the nodes to 'untangle'
the graph.

## Contributing

If you see any issues with the data, please [file an issue!](https://github.com/ndrewtl/hereditary/issues/new)

If you would like to add a person or contribute data,
[edit `data.yml`](https://github.com/ndrewtl/hereditary/edit/main/public/data.yml)

## Credits

Data and images courtesy of their respective Wikipedia articles
