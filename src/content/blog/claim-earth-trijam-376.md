---
title: "Claim Earth: A Trijam #376 Entry About Digging to the Center of the Earth"
description: "How the first version of Claim Earth came together for a 3-hour jam: a plan written before the clock started, a hex cave with sand, water and lava, bombs, a grappling hook and a flag."
date: 2026-06-15
type: postmortem
tags:
  - "Claim Earth"
  - "Godot"
  - "Game jam"
  - "Simulation"
  - "Terrain"
---

The theme of [Trijam #376](https://itch.io/jam/trijam-376) was "Center of Earth". My answer is Claim Earth: some silly competitors planted flags on the surface, but obviously only a flag at the center of the Earth is a valid claim. You dig down through a procedural cave with bombs and a grappling hook, and the deeper you plant your flag, the better your claim.

<iframe src="https://www.youtube-nocookie.com/embed/Ebp7YpLxlmY" title="Claim Earth, Trijam #376 version" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The inspirations are easy to spot. The terrain comes from Noita and Oxygen Not Included: a procedural world made of cells that actually move. The bombs, the hook and the character controls come from Worms.

## The jam and its rules

Trijam is a weekly jam where the goal is to make something playable in three hours. You are allowed to go overtime, but only games made in three hours or less can take first place. The important detail is what counts: coding, art and sound count; writing a design doc, thinking about ideas, compiling, and building the itch.io page do not. You can also split your three hours into as many sessions as you like.

This edition ran from Friday June 12 to Monday June 15 and received 26 entries. Mine was built in (almost) three hours, stretched across the Saturday.

## Planning before the clock

Since design time is free, I front-loaded it. The first commit of the repository contains no gameplay code at all: a game design document, a technical architecture, a 14-step execution plan, and instructions for the coding agents that would implement it. The itch.io page discloses this AI-assisted coding.

The design document fixed the whole scope in advance:

- A procedural map of 100 by 2,000 flat-top hexagons, sealed with indestructible stone on the sides and at the bottom.
- Six materials: air, stone, dirt, sand, water and lava.
- Walking, jumping, air control, and a grappling hook with adjustable rope length and swinging.
- 10 small bombs, 2 large bombs and a single flag per run, with no way to get more.
- A score that exists only once the flag has landed on solid ground. Dying, or losing the flag in lava, discards the run.
- A local personal best and an online leaderboard, with the main menu showing who currently "owns" Earth.

It also listed what was explicitly out of scope: touch controls, gamepads, enemies, upgrades, accounts, an infinite world, and mobile browsers.

The architecture document set the technical constraints. Godot 4.6 with typed GDScript, the Compatibility renderer, and a single-threaded Web export so the game runs in any desktop browser on itch.io. That ruled out C#, which Godot 4.6 cannot export to the Web, and compute shaders, which WebGL 2 does not have. Terrain behavior had to be data-driven: each material is a Godot resource with a motion strategy (stable, falling, liquid), a hazard strategy (none, burial, suffocation, lava) and a blast reaction, instead of a big switch over terrain types.

Each step of the plan had its deliverables, its test gates and its commit message written in advance, so the build order was settled before I started the timer.

## What made it in

The commit history shows the timeline. Steps 0 to 5 landed between 10:31 and 11:16 on Saturday: toolchain, core contracts and hex math, the app shell, deterministic cave generation, chunk rendering and collision, then player movement and a camera that only goes down. Work resumed at 13:32 with fixes to the early presentation, and the remaining steps followed in order: grappling hook, bombs and terrain mutation, hazards and flag scoring, terrain simulation, menus and HUD, leaderboard, art and audio. The Web release build was committed at 15:20.

**Generation.** Multi-octave noise, stretched horizontally so caves form in layers, splits the map into stone, dirt and air. A second, independent noise pass places sand, water and lava pockets, with water and lava only appearing below a certain depth. Then a spawn chamber is carved and the boundaries are sealed. Every run has a seed, and the same seed always produces the same map.

**Bombs.** An explosion asks each cell in its radius how it reacts. Stone becomes dirt, dirt becomes sand, and sand becomes air, so digging through rock takes several blasts. Water dampens the blast, lava detonates any bomb that touches it, and bombs can set off other bombs.

**Simulation.** A cooperative CPU backend keeps two packed byte buffers, the committed world and the next one, and commits a new terrain state every 0.5 seconds while the player, projectiles and rendering update every frame. Sand falls and sinks through liquids, liquids fall and then spread sideways, and water touching lava turns into stone.

**Hazards.** You die by touching lava, staying under water until your oxygen runs out, being buried in sand, standing in your own bomb's lethal radius, or falling out of the world.

**Presentation.** The world is split into chunks of 20 by 32 cells. Only visible chunks get a renderer node and a single collision body, built from the exposed edges of solid cells. There is no node per cell. The player and items are original SVG art, the terrain uses procedural pattern overlays, and the sound effects are synthesized.

**Leaderboard.** Scores go to a SimpleBoards leaderboard. The menu reads "Earth owned by:" followed by the current leader, and a dashed line in the world marks your personal best depth.

By the time the art and audio step was done, the project had 67 automated tests, run headless with GUT. Tests do not make a game fun, but on a three-hour budget, every logic bug caught by a test is time not spent hunting for it in a browser.

## What playing it changed

The plan was good at producing a working game. It could not tell me whether that game felt right. The design document said the exact bomb numbers would be validated through playtesting, and the "bug fixes and gameplay polish" commit on Saturday evening shows how far off the first guesses were:

| | Before | After |
| --- | --- | --- |
| Small bomb blast radius | 2 | 5 |
| Small bomb fuse | 0.7 s | 2.5 s |
| Large bomb blast radius | 4 | 10 |
| Large bomb fuse | 0.9 s | 4 s |

The same commit added a step-up and floor-snapping routine to the character, because a hex floor is a row of small ledges that the player has to get over smoothly. It also added a "showcase" generation pass that places a sand, water and lava pocket in the first hundred rows, so you meet every material early instead of only reading about them in the description.

Not every attempt stuck. An optimization that cached chunk rendering went in at 16:07 and was reverted six minutes later. The simulation did get faster before the deadline, though: on Sunday night I split the terrain into separate static, sand and fluid layers, tracked exactly which cells changed, and moved the simulation from a commit every 0.5 seconds to every 0.1 seconds, with the work spread across frames so the player stays responsive.

## What I take from it

Writing the plan before the timer starts is the most valuable thing I did. The Trijam rules allow it, and it turns the three hours into execution instead of decisions. It also made the scope cut visible: everything on the out-of-scope list stayed out.

The data-driven terrain paid off within the jam itself. Changing bomb balance meant editing resource files, and adding the showcase pocket pass was one new generation pass, without touching the rest of the pipeline.

What a plan cannot replace is playing the game. Every number that mattered for the feel, from the blast radius to the fuse length, changed after the first session, and the simulation went from two terrain commits per second to ten.

Ratings for the jam run until June 17. You can play the game on [itch.io](https://titan-koyos.itch.io/claim-earth), and the source is on [GitHub](https://github.com/florian-noirbent/claimEarth).

## After the jam

Update, June 28: I kept working on the game as I continue to learn Godot, and this video shows the polish update.

<iframe src="https://www.youtube-nocookie.com/embed/O26zDj3Ber0" title="Claim Earth polish update" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The main changes since the jam:

- **A world generator editor addon.** Generation passes became a configurable catalog, with an editor dock and a live preview to tune them inside Godot. The temporary showcase pocket pass was removed once the regular pocket passes were good enough.
- **Better fluids.** Sand, water and lava cells now store a fill amount from 0 to 255 instead of being full or empty. Liquids fall, then flow sideways depending on fill differences, and lava flows like a slow, viscous liquid. Partial cells render at their fill level, with a smoothed surface line.
- **A spawn shaft.** The spawn chamber became a narrow zig-zag shaft with noisy edges that winds down to about depth 100.
- **Presentation.** A menu and UI overhaul, a game background, and textured stone and dirt.

The game has grown a lot since, and it now has its [own page](/games/claim-earth). The [technical deep dive](/blog/claim-earth-simulating-rendering-and-colliding-with-a-texture) explains how the full game simulates, renders and collides with a terrain stored in a texture.
