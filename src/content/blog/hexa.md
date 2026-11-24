---
title: "Hexa"
description: "The last few days I wanted to develop a hexagonal tile engine, by the way make a small 2D game engine using SFML, and also programm a A pathfinding Here is the result: The…"
date: 2014-08-25
type: devlog
tags:
  - "C++"
  - "SFML"
  - "Pathfinding"
  - "Student"
cardImage: /images/blog/hexa/hexa.jpg
---

The last few days I wanted to develop a hexagonal tile engine, by the way make a small 2D game engine using SFML, and also programm a A\* pathfinding

Here is the result:

![hexa](/images/blog/hexa/hexa.jpg)

 The technological choice is mainly because I wanted to code some C++ again, and I also wanted to make my own game engine for a while, even if make it on unity wouldn't even have takken half a day. for now it include game loop, input manager, game scene manager and GUI manager using SFGUI. I would gladly share it, but I'm sure the time needed to get in my engine without documentation is superior to the time needed to remake it from scratch.

It's the first time I use A\*, but I already presented it 2 years ago, to explain my algorythm choice on my end of 3rd year project, so I'm sending you to [that article](/blog/pathfinding-end-of-year-project-part-3), to resum, every case is defined by its cost to come there "G score" added to the estimated cost to the destination "H score", on the screenshoot, first line is H, second is G on every case, so for an obstacle free map this sum is constant, then one just need to always take the smaller value to have the best chances to find quickly the shortest path.

About the hexagonal tile engine, I'm sending you to R[ed blob games website](http://www.redblobgames.com/grids/hexagons/), which almost answered all my questions.

I'd like to share the main problems, I met: first, know where to draw the tile, to do that, I used a non orthonormal space, I'm sharing you the paint draft I used.

![Hexa coord](/images/blog/hexa/Hexa-coord.jpg)

Then I needed to know wich hexagon my mouse is over, the naive implementation was to reverse display function, but what's working for square don't neccesarly work for hexagon, this solution is working but give a very aproximative result as the "hitbox", was in fact a parralelogram following the coordinate system, so I decided in a first time that I would take the distance between my mouse and the center of the hexagon, for the hexagon I found and its neighbors, to select the nearest. And here I got a glitch that made me lost half a day: the pythagorean theorem of course work in a rectangular triangle, and of course in a non orthonormal space, coordinate don't form rectangular angle, so *"distance = sqrt((x1 - x2)² + (y1 - y2)²)"* is false...
