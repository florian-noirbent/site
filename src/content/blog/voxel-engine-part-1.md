---
title: "Voxel engine, part 1"
description: "I'm going to talk about a work in progress project for the first time, but first, in the second article I said I was working on a remake of my first game. Well I have stoped this…"
date: 2013-06-23
type: technical
tags:
  - "Unity"
  - "C#"
  - "Voxel"
  - "Terrain"
  - "Student"
cardImage: /images/blog/voxel-engine-part-1/marshing-cube-house.png
---

I'm going to talk about a work in progress project for the first time, but first, in the second article I said I was working on a remake of my first game. Well I have stoped this project, because there is no one to test it. I said in the introduction that I was making games for myself but thinking at it twice it doesn't really make sense especially for a multiplayer one. The project is working and I'll show it as soon as I have someone to make a video.

So I planned for the next weeks to make experiment project, I'd like to try emerging behavior, like reinvent the [game of life](http://fr.wikipedia.org/wiki/Jeu_de_la_vie) in my own may. But now I started to develop an infinite terrain generator from voxels, like I said I wanted to.

I hesitated a lot between C++ and Unity: C++ bring performance, freedom and make optimization easier. Unity mainly brings me constraints in fact, but a framework like this on Unity open a lot of possibilities to share and interesting reuse, so I chose this solution.

To build a framework that could easily be integrated in another project, I wanted at first be the most coupled as possible, IE, make possible the usage of lights, rigidbodys, etc in a transparent way. For now it's the case, but I'll certainly will surrender some possibilities for the future version so Unity will lose much of its interest, but right now advanced lightening computation are impossible and using a mesh collider to evaluate physics from triangles -while every needed information could be taken directly from the voxels- is very ineficient (mesh colliders generation take about 90% of the computation time right now!).

\*The original Unity Web Player demo is no longer available.\*

A glitch may display Escape instead, while i'm fixing it you can use this link.

ZQSD/WASD to move, mouse for the camera rotation, left click to add, right click to delete (hold in marching cube)

There is three buttons to switch between isosurface extractions:

-cube, minecraft style blocks

-marching cube, smooth render

-marching cube hybrid, juste a marching cube with saturated values to get back some angles, (see *game design* for the reason)

The terrain is infinite in the 6 directions.

## Game design

Before starting this experimentation, I naively imagined that minecraft and all its clones represented their voxels by cube because it was easier. Actually implementing other extraction is a bit more complex, but no matter which solution is chosen, the time to implement it stay really small compared to the time needed for a full game. I think they all use cubes for the "Lego" side: it make building easy; I tried to build a house in the marching cube version it was definitively not fun. That's why i tried a saturated marching cube version, to get back the build side, but I don't really believe we can get back the fast and fun that we have in building dirt houses in minecraft. Well, a voxel engine don't have to be about making a minecraft clone either, and we can have a game not about building stuff at all, I'm thinking about a Worms like game for example.

![marshing cube house](/images/blog/voxel-engine-part-1/marshing-cube-house.png)

*Looks like yoda's house on Dagobah.*

## What next?

I'll first try some other isosurface extraction algorithms, first [dual contouring](http://www.frankpetterson.com/publications/dualcontour/dualcontour.pdf) which seams to have [promising result](http://procworld.blogspot.fr/)s, I also discovered [adaptative skeleton climbing](http://www.cse.cuhk.edu.hk/~ttwong/papers/asc/asc.html), which seems to allow to generate multiple [LOD](http://fr.wikipedia.org/wiki/Level_of_detail) in a very effective way, and i'd like to try some homemade algorithms using a base of predefined geometry to make the map look like the saturated marching cube but with an easy case by case based edition. I discovered a project using a similar approach: [blockscape](http://www.blockscape.com/v2/), which seems to be a nice compromise between visual quality, and ease of editing for a player. and there is still the possibility to combine multiple method like [starforge](http://www.starforge.com/) do, to differentiate the terrain, in marching cube and the cubic constructions.

Once I'm decided in which method I want to use for my framework, I'll implement it with compute shaders (my article about it will also be an occasion to talk about my tries with CUDA and openCL), and i'll delete the other methods. One can think it's sad not to keep every possibility for a framework, but too much thing will depend on it to be able to support à bunch of different methods (shaders, physic, dynamic light mapping, maybe fluids ...)

In another domain, I'd like to study terrain generation algorithms, try different type of noises, and merge them to get a realistic terrain while staying efficient enough for real time on GPU, it's almost another project, and the small preview I got of it made me discover how complex this subject is.

But right now I need to rework on the data structure of chunks, the ruptures you can see in editing the marching cube come from the fact that I can't access neighboring chunks quickly.
