---
title: "End-of-Year Project, Part 2: The Map Editor"
description: "How tile engines draw 2D maps with layers, a tour of the modular map editor behind my end-of-year project, and the features I had to cut."
date: 2013-05-12
type: devlog
tags:
  - "Epitech"
  - "XNA"
  - "End-of-year project"
  - "Xbox"
  - "C#"
  - "Student"
---

As promised in [part 1](/blog/end-of-year-project-part-1), this article covers the editor of my end-of-year project.

## How a tile engine works

Before talking about the editor, you need to know how 2D terrain is usually built in video games (the same technique can be used in 3D, although that's less common).

The terrain is divided into a grid of squares, called tiles. Each cell stores an ID that refers to a texture, and the whole map is saved as a two-dimensional array of these IDs. To draw the map, you loop over the visible cells, read each ID and draw the matching texture at that cell's position. This lets you reuse the same small images across the whole map: with just a 64x64 grass texture and a 64x64 road texture, you can draw a path as long as you like, at almost no memory cost.

On its own, this gives a pretty ugly result. To get something decent, you need **layers**: each cell holds not one ID but several, drawn on top of each other. This makes level design much more comfortable. If you want one chest on grass and another on the road, you draw a single chest with a transparent background and place it on top of the ground, instead of making a chest texture for every ground type in your game.

The second benefit is that layers can be drawn separately, some before the characters and some after. A background layer ends up behind the characters and a foreground layer in front of them, so characters can walk *behind* things. In this project, the treetops and house roofs are in the foreground layer.

My end-of-year project uses four layers: the ground, the objects, the foreground, and a "dynamic" layer. That last one is never drawn directly; it holds the gameplay data attached to the map, such as collisions, spawn positions and triggers.

## The editor

So all the editor really has to do is write the texture IDs of each cell to a file the game engine can read. There's nothing mysterious about it: it's a plain text file of numbers separated by spaces, and you could even edit a map in Notepad. As last time, the easiest way to show it is a video:

<iframe src="https://www.youtube-nocookie.com/embed/BZuIZbumIJ8" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## What I had to leave out

My original plan was to spend the whole year on the editor. Once it became clear that my teammates wouldn't have time for the project, I had to drop many features so that the game itself would exist. Here are some of the ones I had in mind.

**A boss editor.** Beyond editing maps, the idea was to create monsters by picking a sprite, setting their stats, then choosing their abilities from a list and tweaking those skills.

**Smarter map generation, above all.** Right now the generator joins modules using only one piece of information: which of their four sides (north, south, east, west) open onto a neighbor. As you saw in the gameplay video, this produces fairly generic level design where everything looks alike. I could have added more constraints per module, for example modules containing quest objects that must appear exactly once, around the middle of the level.

**Layers in the generator.** For instance, running a river through the town on the first map while keeping the existing paths intact.

**Fixed groups of modules,** to build things like a boss arena larger than a single module.

**Teleporters to extra modules,** so players could enter houses or caves.

**Level design tools,** such as saved patterns to place trees or houses in a single click, building on the copy-paste feature I had already started.

As you can see, I wasn't short of ideas. The next article covers the monster AI and pathfinding.
