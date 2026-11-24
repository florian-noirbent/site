---
title: "Hexa: A Hexagonal Tile Engine with A* Pathfinding"
description: "A small C++ and SFML 2D engine with a hexagonal tile map and A* pathfinding, plus the coordinate pitfalls of drawing and picking hexagons."
date: 2014-08-25
type: devlog
tags:
  - "C++"
  - "SFML"
  - "Pathfinding"
  - "Student"
cardImage: /images/blog/hexa/hexa.jpg
---

Over the last few days I set myself three goals: build a hexagonal tile engine, write a small 2D game engine on top of SFML along the way, and implement A\* pathfinding.

Here is the result:

![Hexagonal grid with A* pathfinding, each tile showing its H and G scores](/images/blog/hexa/hexa.jpg)

## Why C++ and my own engine

I mainly picked these tools because I wanted to write some C++ again, and I had wanted to build my own game engine for a while, even though doing this in Unity wouldn't have taken half a day. For now, the engine has a game loop, an input manager, a scene manager and a GUI manager based on SFGUI. I'd gladly share it, but without documentation, getting into it would take longer than rewriting it from scratch.

## A\* pathfinding

This is the first time I've actually implemented A\*, although I described it over a year ago when explaining the algorithm I chose for my end-of-third-year project, so I'll refer you to [that article](/blog/pathfinding-end-of-year-project-part-3) for the details. In short, each cell gets a score that adds two values: the G score, the cost of reaching it from the start, and the H score, the estimated cost from there to the destination. On the screenshot, the first line in each cell is H and the second is G. On a map without obstacles, this sum stays constant along the shortest path and only grows for cells that stray from it. By always expanding the cell with the smallest sum, the algorithm reaches the destination quickly while still guaranteeing the shortest path.

## Hexagonal tiles

For hexagonal grids in general, I'll point you to the [Red Blob Games website](http://www.redblobgames.com/grids/hexagons/), which answered almost all my questions.

I'd still like to share the main problems I ran into. The first was knowing where to draw each tile. Hexagons don't line up on a square grid, so I used a non-orthonormal coordinate system: two axes that are not perpendicular, following the directions of the hexagon rows. Here is the rough sketch I made in Paint:

![Sketch of the skewed coordinate system used to position hexagons](/images/blog/hexa/Hexa-coord.jpg)

Next, I needed to know which hexagon the mouse is over. The naive approach is to invert the drawing function, but what works for squares doesn't necessarily work for hexagons. It does give an answer, but only a rough one, because the "hitbox" it produces is actually a parallelogram aligned with the coordinate axes, not a hexagon. So I refined it: take the hexagon found this way along with its neighbors, measure the distance from the mouse to each of their centers, and select the nearest one.

And this is where a bug cost me half a day. The Pythagorean theorem only holds in a right triangle, and in a non-orthonormal system the axes are not at right angles, so *"distance = sqrt((x1 - x2)² + (y1 - y2)²)"* gives the wrong answer when applied directly to the skewed coordinates. Distances have to be measured in an orthonormal system, for example by converting both points back to screen coordinates first.

*The source code of the engine and the pathfinding prototype is on GitHub: [GameEngine2D](https://github.com/florian-noirbent/GameEngine2D).*
