---
title: Escape
description: "A physics puzzle game: place triangles, cubes and teleporters on a rusty wall to guide a ball from the entry pipe to the exit, while a trigger flips how every object behaves."
cardImage: /images/games/escape-placeholder.svg
date: 2013-05-18
status: unreleased
platforms:
  - Web (Unity Web Player)
engine: Unity 4
genre: Physics puzzle
releaseNote: Student prototype made with e-artsup students for a game design module. It was playable in the browser in 2013; the Unity Web Player is no longer supported.
links:
  source: https://github.com/florian-noirbent/Escape
---

## Overview

A ball drops out of an entry pipe. Your job is to get it into the exit pipe on the other side of a riveted, rusty wall. You can't touch the ball: you can only place objects on the wall's grid, then watch physics do the rest.

Every level also has a trigger. The ball must hit it at least once to open the exit, and each hit switches it between green and red, which changes how your objects behave. A path that works before the switch may fail after it, so solutions are about timing as much as placement.

## The objects

- **Triangle:** the ball bounces off it when the trigger is green, and rolls along its slope when it is red.
- **Cube:** catches the ball, recenters it and sends it off at a right angle, whatever the trigger's state.
- **Teleporter:** sends the ball from one portal to the other when the trigger is green, and does nothing when it is red.

Each level gives you a small inventory of objects and comes with some already fixed in place. There are six levels, three of them tutorials, and a full run takes 10 to 30 minutes.

## Media

![The level select screen: six riveted metal buttons on a rusty diamond-plate wall](/images/games/escape/level-select.webp)

![A level in the Unity editor: the grid wall with its rows of slots](/images/games/escape/editor-level.webp)

## The team

Escape was made in spring 2013 for a game design module run jointly by Epitech and e-artsup, an art and design school. I designed the game with the team, wrote the trickiest parts of the code and made the 3D models; second-year e-artsup students made the textures and interface art, and first-year Epitech students joined the programming.
