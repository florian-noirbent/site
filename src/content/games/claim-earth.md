---
title: "Claim Earth"
description: "Cartoon arcade descent through a generated hex cave where water, lava, sand and gas flow in real time. Dig with bombs, swing on a grappling hook, and plant your flag before the cave gets you."
cardImage: /images/games/claim-earth/card.webp
date: 2026-11-22
status: released
platforms:
  - Web
  - Windows
engine: Godot 4.7
genre: Arcade platformer
releaseNote: Free to play in the browser on itch.io. Started as a game jam entry for the "Center of Earth" theme.
accessUrl: https://titan-koyos.itch.io/claim-earth
accessLabel: Play on itch.io
featured: true
---

## Overview

Claim Earth is a small arcade game about going deeper than you should. You descend through a randomly generated hex cave, blasting through rock with bombs and swinging across gaps with a grappling hook. Your depth only counts once you throw your flag and it lands safely: die first, and the run is lost.

The cave is alive. Every bomb opens new paths for sand, water, lava, steam, acid and poisonous gas, so a single blast can turn into a flood, a steam pocket, or a brand new route down.

- Generated caves with deterministic seeds
- Bombs, grappling hook and loot chests with run-changing supplies
- Permanent perks hidden in purple geodes
- Online leaderboard for the deepest claimed flags

## Trailer

<iframe src="https://www.youtube-nocookie.com/embed/qJeOVA3A9LI" title="Claim Earth trailer" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Under the hood

The whole terrain lives in a single texture, four bytes per hex. GPU render passes run the cellular automaton that moves the materials, one shader draws the cave on a single quad, and custom collision code lets the player stand on the result. No terrain mesh or collider is ever rebuilt when the map changes.

- [Technical deep dive: Simulating, Rendering, and Colliding with a Texture](https://titan-koyos.itch.io/claim-earth/devlog/1799603/claim-earth-simulating-rendering-and-colliding-with-a-texture)
- [Source code on GitHub](https://github.com/florian-noirbent/claimEarth)
