---
title: "Bomberman 3D: Lessons from My First OpenGL Game"
description: "A 3D Bomberman in C++ and OpenGL from my second year at Epitech, and the mistakes I made with rendering, particles and AI."
date: 2013-04-27
type: devlog
tags:
  - "Bomberman"
  - "Epitech"
  - "C++"
  - "OpenGL"
  - "Student"
---

Next up is a 3D Bomberman I made in my second year at Epitech. Once again, screenshots are hard to come by. It runs on Linux and is written in C++ with GLUT, OpenGL and a library provided by my school for loading animated FBX models. On this project, I worked on a particle generator for the bomb explosions, the AI, and of course the game mechanics and rendering.

Since this was my first time using OpenGL, it seems worth going over the mistakes I made, in case it saves someone from repeating them.

## Rendering

At the time I didn't understand how the GPU pipeline works, and I naively followed tutorials from the Site du Zéro (a French programming tutorial site). I used the old immediate-mode functions, `glBegin()` and `glEnd()`, which send every vertex from the CPU to the GPU one call at a time, every frame, instead of uploading the geometry once into a VBO (vertex buffer object) that stays in GPU memory. On top of that, every crate, wall, character and bomb made its own separate calls. The result was a noticeable slowdown as soon as the map grew beyond 100x100, with only a few thousand polygons on screen.

## Particle Generator

This one gave me a hard time. The basic idea is a `ParticleGenerator` class holding a list of quads. Each `Update()` moves the particles according to their properties (speed, direction, applied forces and so on) and spawns new ones from a pool, and `Draw()` simply renders the list of quads.

That's easy on paper. In practice, particles are almost always transparent, and transparent surfaces have to be drawn after whatever lies behind them, or you get very visible artifacts. My first solution was to sort the particles by distance from the camera every frame, but performance was too poor. The second was to disable depth-buffer writes while drawing the particles. They are still hidden by opaque geometry in front of them, but they no longer hide each other, so the drawing order between particles stops mattering. This gives perfectly acceptable results when all the particles have the same color, which was the case here.

There's no perfect solution for transparency in real-time 3D rendering; it's always about finding an acceptable compromise for a given situation. The one rule that always holds is to render all opaque objects first.

## AI

My mistake with the AI was not building it into the design from the start. I just thought, "I'll deal with it at the end." When I got there and finally asked myself how to code it, I realized I had nothing to base a heuristic on. The map was stored as a flat list of blocks, and the only information available was whether a character was currently colliding with something. There was no way to build pathfinding on top of that, so the game ended up multiplayer-only.

Since then, I always start by designing the AI: how it will work and what information it will need. Usually that means a 2D grid where each cell is weighted by how easy it is to traverse, which pathfinding algorithms can work with directly. More complex behaviors, like anticipating lines of sight or fleeing intelligently, need extra data in the scene to help the AI understand its surroundings.
