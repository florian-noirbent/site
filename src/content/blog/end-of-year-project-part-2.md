---
title: "End-of-year project – part 2"
description: "As i said, I'll talk about the editor of my end-of-year project this time. The principle of tile engine before talking about the editor, it's important to understand how 2D…"
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

As i said, I'll talk about the editor of my end-of-year project this time.

## The principle of *tile engine*

before talking about the editor, it's important to understand how 2D terrain are made in video games (it could also be used for a 3D games even if it's less common).

the terrain is split in squares along a grid, each "square" contain an ID matching the texture to use, saved in a 2 dimensional array. when you want to draw, you just read through the array of every visible cells, and for each, read the ID and draw the matching texture at the current square position. This allow to reuse many times the same element over the map, for example, with just a grass and road texture 64x64, you can draw a path as long as you want.

If we just stayed on that the result would be pretty ugly, to get a correct result, we need layers, IE for each cells you don't only have on ID but several, which get draw one above the others. It bring some comfort in the level design, for example, if you want a chest above grass and another above the road, you'll just make a chest with a transparent contour and put it above the ground, it avoid to make the texture chest with every possible ground present in your game. Next important thing, you can draw each layer separately to have one layer behind the characters (the background layer) and one before (the foreground layer), so the characters appear behind those elements, for example in this project, the top of the trees and roofs of the houses are in this layer. In this end-of-year project I have four layers: the ground, the objects, the foreground and a "dynamic layer", which hold every information about collision with the map, spawns position, triggers, etc even if it's not directly draw.

## The editor

You understood, the editor just have to write IDs of textures for each square in a file to make it usable by the game engine, nothing mystic behind it's a just a text file holding numbers separated by space, you can even edit the map with a notepad. Like the last time, the easiest way is to show you the editor with a video:

<iframe src="https://www.youtube-nocookie.com/embed/BZuIZbumIJ8" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

At the beginning, I had planned to spend all the time to the editor, but when I understood that my mates didn't had time to work on the project, I had to give up many features to make the game. Here are some of the feature I wanted to implement.

A boss editor: besides editing the map, we wanted to create monsters from a choice of textures, then set the characteristic, then choose there capacities in a list with some tweaks over these skills.

But mainly a map generation much more advanced now the editor just join the modules with only the information of there cardinals points link, as you saw in the gameplay video, it make a level design "standard", everything looks alike; I could have add more variables on every module, for example modules holding quest objects that need to appear once and only once, at half the level.

I could have had some layers to the map generator too, for example make a river go through the town of the first map, while keeping the existing paths.

I also could have make fix group of modules, to allow, for example, to make an arena for boss encounter without being limited by a module size.

We could also imagine some teleporter to additional modules, to allow players to enter houses and caves for example.

Finally I would have liked to had some tools to make level design easier, like saving patterns, to drop trees, houses etc in a single click, too deepen what I had began with the copy-paste feature.

So, as you can see, I didn't lacked of ideas :). In an upcoming article, I'll talk about the monsters AI and pathfinding.
