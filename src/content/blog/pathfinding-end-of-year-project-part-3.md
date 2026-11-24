---
title: "End-of-Year Project, Part 3: Pathfinding with Collaborative Diffusion"
description: "Why I chose collaborative diffusion over A* for the monsters of my end-of-year project: near-constant cost per crowd, emergent group tactics, and how to optimize it."
date: 2013-05-25
type: technical
tags:
  - "Epitech"
  - "C#"
  - "XNA"
  - "End-of-year project"
  - "Xbox"
  - "Pathfinding"
  - "AI"
  - "Student"
---

To close this series on my end-of-year project (see [part 1](/blog/end-of-year-project-part-1) and [part 2](/blog/end-of-year-project-part-2)), let's look at the monster AI, and more specifically at pathfinding: finding the shortest path to a destination, possibly through a maze.

## The usual answer: A\*

The method I used departs from the classic [A\*](http://en.wikipedia.org/wiki/A*_search_algorithm), which is the most widely used pathfinding algorithm today and well worth reading up on if you don't know it yet. In short, A\* treats the map as a graph and keeps a list of candidate nodes to explore. For each node it adds the cost already paid to reach it to an estimate of the remaining distance, usually the straight-line distance to the goal, and it always expands the candidate with the lowest total. In open terrain, the search therefore heads straight for the goal; when it runs into an obstacle, it falls back on the next most promising nodes until it finds a way around. As long as the estimate never overestimates the real distance, the path it returns is the shortest one.

![Animation of A* exploring a grid and working its way around an obstacle toward the goal](http://upload.wikimedia.org/wikipedia/commons/5/5d/Astar_progress_animation.gif)

Because each agent runs its own search, many agents can head for different destinations under different constraints. In a military game, for example, a tank can be told to ignore certain nodes while infantry can use all of them, which spares you the classic sight of an AI-controlled tank trying to squeeze through a door.

But A\* has two major drawbacks that pushed me toward another solution:

- **Every agent computes its own path**, so the cost grows linearly with the number of agents: double the monsters, double the computation time. In this project I wanted a huge number of monsters all chasing the same targets, so recomputing essentially the same paths for each of them would have been a waste.
- **Every agent moves without regard for the others**, which causes serious collision problems. You have to add a collision avoidance system on top, whose cost is at best *n log n* and can become quadratic depending on the approach. Even then, the agents remain "selfish": each one optimizes its own path, and nobody cooperates.

## Collaborative diffusion

I implemented [collaborative diffusion](http://scalablegamedesign.cs.colorado.edu/wiki/Collaborative_Diffusion) instead, which gave me:

- **A nearly constant cost with respect to the number of monsters.** The work is done on the map, not per agent, so moving every monster takes (almost) the same time whether there are ten or a thousand. I can spawn as many as I want.
- **Group behavior for free.** The monsters don't just trail single-file behind one another: they try to surround the player, block every escape route, split up to go after each player, and so on.

The trade-off is losing the flexibility of A\* described above, but this game didn't need it. There is no perfect solution that works in every scenario; each new project means weighing the options again in its own context.

## How it works

Each player emits a "scent" that spreads across the map. Blocking cells stop it, and slowing cells (difficult terrain) weaken it. The scent is strongest at the player's position and fades with distance, so a monster only has to move to the neighboring cell with the highest value to reach the player.

The collaborative part comes next: each monster also lowers the scent value on its own cell. A monster coming up behind it then sees a weaker trail on that route and picks a different free path instead. The amount of reduction controls how long a detour a following monster is willing to take rather than walk in its predecessor's footsteps.

Here is an illustration of the technique applied to Pac-Man, with the diffused scent shown in yellow.

![Pac-Man maze with the ghosts' scent map diffused through the corridors in yellow](https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQbsaE54STX_8Tj6sUJXQpm2JVzGmfUUTVGSZ84TG2Hm029qqCS)

## Optimizations

The idea is simple, and so is the implementation, but a few optimizations are essential:

- **Limit the computation area.** For Pac-Man, you can afford to update the whole map, but in a large world like mine, with maps of more than 5 million tiles, that's out of the question. You define a zone around each player where the scent is computed. In my end-of-year project it's 50 by 50 cells, so any monster more than 25 cells from a player stops moving, which matches exactly their "standby" distance.
- **Update incrementally, with two arrays.** Don't clear the map and rebuild it from scratch every frame with a recursive flood fill. Instead, assume the scent map changes only a little between two iterations. Keep two arrays: at each iteration, compute every cell's new value from its neighbors' values in the first array, write it into the second, then swap the two (a technique known as double buffering). The players only set the value of their own cell, and the scent spreads one step further across the map at each iteration. Here again, the cost no longer depends on the number of agents emitting a scent.

There are also a couple of optional ones:

- **Don't update every frame.** The scent map only needs to refresh faster than an agent takes to move from one cell to the next. In my game, five updates per second are enough for correct behavior.
- **Run it on the GPU.** The double-buffered update makes every cell independent of the others within an iteration, so they can all be computed in parallel. That should immediately make you think of GPGPU. I didn't do it in my game because the results were already excellent, but with CUDA (or OpenCL) you should be able to refresh millions of cells per iteration.
