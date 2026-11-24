---
title: "Mars Lander: A* Pathfinding to Land on Mars, and Other Programming Games"
description: "Solving CodinGame's Mars Lander Episode 3 by rasterizing the terrain, running A* and following the path with simple control rules, plus a look at my Screeps AI and Rosil."
date: 2022-07-21
type: technical
tags:
  - "Mars Lander"
  - "CodinGame"
  - "C#"
  - "Pathfinding"
  - "AI"
  - "WPF"
---

[CodinGame](https://www.codingame.com/) is a site full of programming puzzles where your code plays the game: each turn the program reads the state of the world on standard input and writes its commands on standard output. I recently started a repository to keep my solutions, and the first one I tackled was [Mars Lander Episode 3](https://www.codingame.com/training/expert/mars-lander-episode-3), one of the puzzles in the "expert" category. The program pilots a lander and has to bring it down safely on the only flat piece of ground, which in this episode is hidden behind cliffs and overhangs.

<iframe src="https://www.youtube-nocookie.com/embed/QqbNuwMlmI8" title="Mars Lander" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The rules

The map is a 7000 m by 3000 m slice of Mars. The ground is given once at the start as a list of points forming a polyline, and somewhere along it there is a flat segment at least 1000 m wide. Gravity is 3.711 m/s² and there is no atmosphere. Each turn, the program receives the lander's position, horizontal and vertical speed, remaining fuel, rotation and thrust, and answers with two numbers:

- **a rotation** between -90° and 90°, which can change by at most 15° per turn;
- **a thrust power** between 0 and 4, which can change by at most 1 per turn. A power of X gives X m/s² of acceleration in the direction the lander is pointing and burns X liters of fuel.

To land, the lander must touch the flat ground perfectly upright, with a vertical speed of at most 40 m/s and a horizontal speed of at most 20 m/s. You get 100 ms per turn to answer.

The first two episodes can be solved with a few well-chosen rules, because the lander has a clear way to the landing zone. Episode 3 is different: on some maps the lander starts on one side of a mountain and the landing zone sits in a cave on the other side. Flying straight at the target ends in a crash, so the lander needs to know *where* to go before worrying about *how* to get there.

## My approach

I split the problem into a planning phase, run once on the first turn, and a control phase, run every turn:

1. Rasterize the vector terrain into a grid.
2. Run A\* pathfinding on that grid.
3. Clean up the path by removing intermediate waypoints wherever there is a direct line of sight.
4. Follow the path with ad-hoc control rules.

Everything is in a single C# file, [MarsLander.cs](https://github.com/florian-noirbent/CodingGame/blob/master/MarsLander/MarsLander/MarsLander.cs), which is what runs on CodinGame.

### From vectors to a grid

The terrain is a list of segments, but A\* works on a graph, and the simplest graph is a grid. The map is cut into square cells: 150 m cells in the version I submit, which gives a grid of 46 by 20 cells. Each terrain segment is then rasterized: I sample it every cell-length and mark every cell a sample falls into as a wall.

Because the lander is not a point and has a lot of inertia, I also mark the four neighbors of every wall cell as "close to a wall" and blocked. That one-cell margin keeps the path from hugging the rock.

The destination is the middle of the flat segment, detected while reading the terrain (two consecutive points with the same height). I raise it by two cells: the landing zone itself is on the ground, so its cell is a wall and the pathfinding would never reach it. The last stretch, from that point down to the ground, is handled separately.

### A\*

I already described A\* in my article on [pathfinding for my end-of-year project](/blog/pathfinding-end-of-year-project-part-3) and implemented it on a hexagonal grid in [Hexa](/blog/hexa), so here is just the short version. Every cell stores a G score (the number of steps from the start) and an H score (the straight-line distance to the destination). The algorithm keeps an open list of candidate cells, always expands the one with the lowest G + H, and records for each cell the neighbor it was reached from. When the destination is reached, following those links backward gives the path.

My implementation uses four neighbors per cell, no diagonals, and a Euclidean distance for H. It is not optimized at all: the open list is a plain list sorted on every iteration, and the closed list is searched linearly. On a grid of under a thousand cells, computed once at the start, it doesn't matter.

### Cleaning up the path

A path on a four-neighbor grid is a staircase of tiny steps, which is useless for a lander that takes many seconds to change direction. So I simplify it: starting from a waypoint, I look further and further along the path as long as there is a clear line of sight (I rasterize the segment between the two points and check that no cell is blocked), then remove every waypoint in between. The result is a handful of long, straight segments.

![The WPF visualizer: terrain in black, wall cells in dark red, the safety margin in pink, the start in green, the target in blue and the cleaned-up path as a blue line](/images/blog/mars-lander-and-coding-games/pathfinding-visualizer.png)

To debug all this, I wrote a small WPF application that shares the same code. I paste a map in the text box on the right, choose the grid resolution, and it draws the terrain, the blocked cells and the path. Moving the mouse over the canvas draws its projection onto the path (the purple line in the screenshot), which I used to check the math the controller relies on.

### Following the path

With a path, flying becomes a local problem: stay close to the current segment and move toward the next waypoint. Every turn, the controller projects the lander's position onto the current segment. As soon as that projection is within 500 m of the next waypoint, it switches to the following segment: waiting until the lander actually reaches a waypoint would be too late, given how long it takes to turn and brake.

The rules themselves are simple:

- If the lander is more than 80 m below the path and falling, it goes upright at full thrust, whatever its horizontal speed.
- If it is already moving toward the next waypoint at more than 30 m/s horizontally, it stays upright to keep that speed without adding more.
- Otherwise, it tilts 20° toward the waypoint to accelerate (or brake) horizontally.
- Thrust is 4 by default, and drops to 2 to let the lander sink when it is above the path or the next waypoint is lower, as long as it is not already falling faster than 20 m/s.

On the last segment, a dedicated landing routine takes over: it tilts 15° against any horizontal speed above 8 m/s, and otherwise stays upright with thrust 2, switching to 4 when the vertical speed exceeds 35 m/s to stay under the 40 m/s limit at touchdown.

## Result and post-mortem

The video above shows the result. It works, but if I were to start again, I would do a few things differently:

- **Build a navmesh from the terrain vectors instead of rasterizing.** The terrain is already made of segments; a navigation mesh built directly from them would be more efficient, more precise, and less work than the grid, the rasterization and the cleanup pass.
- **Turn the segments into a spline.** The lander cannot follow sharp corners anyway, and a smooth curve would be a better target.
- **Replace the control rules.** The hand-written rules are the weak part: they work on the maps I tested but wouldn't hold up in a lot of cases. Training a neural network to follow the path would be an interesting experiment.

## Code vs Zombies

The same day, I also committed a first answer to [Code vs Zombies](https://www.codingame.com/multiplayer/optimization/code-vs-zombies), an optimization puzzle. You control Ash, who moves 1000 units per turn and automatically shoots every zombie within 2000 units, while the zombies move 400 units per turn toward the nearest human. My [Python version](https://github.com/florian-noirbent/CodingGame/blob/master/CodeVsZombies/CodeVsZombies.py) is a single heuristic: every turn, among the humans that can still be saved, pick the one with a zombie closest to them and walk toward them. A human is considered savable when the zombie's distance times 2.5 (the speed ratio between Ash and a zombie) is greater than Ash's distance minus his 2000-unit shooting range. It keeps humans alive but makes no attempt at a high score, which in this puzzle rewards killing many zombies at once.

## Other programming games: Screeps

CodinGame is not my first contact with games played by code. In 2016 I spent a few weeks on [Screeps](https://screeps.com/), an MMO real-time strategy game where you don't control anything with the mouse: you write JavaScript that runs every tick on the server and drives your units, called creeps, and your buildings, even while you are offline. My code is on GitHub as [ScreepsIA](https://github.com/florian-noirbent/ScreepsIA).

The architecture is role-based. Each creep stores a role in its memory (harvester, hauler, builder, upgrader, repairer, protector, attacker, colonist, scout, and a "thief" that steals energy from a flagged room), and each role is a module with two functions: `getSpawnInfo`, which decides whether the colony needs one more creep of that role and with what body, and `run`, which drives one creep. The spawn walks through the roles in priority order and builds the first one that is needed, so harvesters and haulers always come before builders and attackers. Bodies scale with the energy available, from a 4-part harvester at the start to a 10-part one once the room has grown.

A few details I still like:

- **Static mining.** When a room is first claimed, the code counts the free tiles around each energy source to know how many harvesters can work it at once. Harvesters then stay at their source and drop energy into a container, which they also repair, while haulers carry it to where it is needed.
- **Multi-room expansion with flags.** Placing a flag in the game assigns it to the nearest owned room, which then sends colonists, reserves the room and starts harvesting it remotely.
- **Defense.** Rooms next to a colony report hostile creeps; civilian creeps flee from armed enemies, remote harvesting is suspended in invaded rooms, towers shoot the closest hostile and repair structures otherwise, and the room triggers safe mode when walls get too damaged by a player attack.
- **Robustness.** Every room, structure and creep update is wrapped in its own try/catch, so a bug in one role doesn't stop the whole colony for that tick.

## Rosil

Closer to the present, I recently started [Rosil](https://github.com/florian-noirbent/Rosil), short for "RObot Scripting Language": a small scripting language of my own, with an indentation-based syntax, classes, properties, enums and string interpolation. So far it has a C++ tokenizer, a C++/CLI wrapper to use it from .NET, a C# language server and a Visual Studio Code extension providing syntax highlighting. It is still at a very early stage, but it comes from the same interest: writing code that drives robots, and building the tools to do it.

## Links

- [Source code of all my CodinGame solutions](https://github.com/florian-noirbent/CodingGame) ([Mars Lander folder](https://github.com/florian-noirbent/CodingGame/tree/master/MarsLander))
- [Mars Lander Episode 3 on CodinGame](https://www.codingame.com/training/expert/mars-lander-episode-3)
- [ScreepsIA](https://github.com/florian-noirbent/ScreepsIA) and [Screeps](https://screeps.com/)
- [Rosil](https://github.com/florian-noirbent/Rosil)
