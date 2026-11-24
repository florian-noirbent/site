---
title: "Bomberman"
description: "I continue the presentation of my projects with a bomberman 3D I made in my second years at Epitech. Once again it's hard to find a scree,shot, it works on linux, in C++ with…"
date: 2013-04-27
type: devlog
tags:
  - "Bomberman"
  - "Epitech"
  - "C++"
  - "OpenGL"
  - "Student"
---

I continue the presentation of my projects with a bomberman 3D I made in my second years at Epitech. Once again it's hard to find a scree,shot, it works on linux, in C++ with glut, openGL and a library from my school to load animated models in fbx. In this project, i worked on a particle generator, for the bomb's explosion, an IA, and of course game mechanics and rendering.

to ilustrate with google again, it looked almost like this (without the GUI^^):

It seams interesting to come back on the mistakes I made in this first time with openGL, if it can prevent someone to reproduce them:

## Display:

I didn't know the GPU's pipeline at this time, and I followed naively tutorials from the "site du 0"(french web site about programming), I used the old functions glBegin() and glEnd(), instead of going with a VBO (vetex buffer object), and every crates, walls, characters and bombs used it's own call to these functions, which has noticeable slow as soon as the map exceed 100x100 (for only few thousands polygon).

## Particle Generator:

I have struggled on this, the base concept is to have a "ParticleGenerator" class holding a list of quads, every Update() move them according to their characteristic (speed, direction, applied forces,...) then instantiate -from the pool- new particles, and Draw() call just render the quad list. on paper it's easy, in practice, particles are always transparent. When you draw transparency, triangles behind must have been randered first, or there is very noticeable artifact, the first solution I found was too sort particles with their distance from the camera, every frame, but performance where too poor. The second solution as been to disable the Zbuffer writing while rendering the particles, ie, it's like every particle are always in front, which give totally acceptable rendering if every particles have the same color, and it was the case. There is no perfect solution when it comes to transparency in 3D real time rendering, it's only about finding an acceptable compromise in a given situation, the only thing that is always true is to render every opaque objects first.

## AI:

The mistake I made about the AI, is to not incorporate it into the design, I just though "I'll see at the end". When I got there, and I finally asked myself how to code it, I realized that I had nothing for an heuristic, the "map" was saved in a list of block, the only information I had was to know if the IA currently collide . No way to build a pathfinding with that, so I ended with a multiplayer only game. Since that, I always start by designing the IA, think about how it will works, what information will I need. Usually it need a 2D array with weighted squares according to their "traversability" for movements, but there is always more complex subjects like anticipate the line of sight, running away smartly, that need extra data in scene to help the AI to locate itself in the environment.
