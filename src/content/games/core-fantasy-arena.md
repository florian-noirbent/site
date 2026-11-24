---
title: Core Fantasy Arena
description: "A 4v4 fantasy arena in the spirit of Guild Wars: pick your gear, fill an 8-skill bar, manage your energy and win team fights on the Core platform."
cardImage: /images/games/core-fantasy-arena/arena.webp
date: 2022-05-15
status: unreleased
platforms:
  - Core (PC)
engine: Core (Unreal Engine 4, Lua)
genre: Team arena RPG (4v4)
releaseNote: Unreleased prototype built in 2021–2022 to learn the Core engine. The combat systems and the match loop work; the content is still a single weapon and skill.
links:
  source: https://github.com/florian-noirbent/CoreFantasyArena
---

## Overview

Core Fantasy Arena is a team arena game inspired by the PvP of Guild Wars 1. Two teams of four meet in a walled desert arena, and the fight is won before it starts as much as during it: what you equip decides which skills you bring, and once the round begins, your skill bar is what you have to work with.

It is built on [Core](https://en.wikipedia.org/wiki/Core_(video_game)), Manticore Games' Unreal-based platform for multiplayer games, and it was my way of learning the engine.

## How a match plays

- **Teams:** when you join, you are placed in the red or the blue team, whichever is smaller.
- **Start:** once eight players are in, an 8-second countdown starts the round, so every match is a 4v4. Players who arrive during a match wait for the next one.
- **Victory:** a round ends when one team has no one left standing, then everyone heads back to the lobby for the next match.

## Combat

- **An 8-skill bar:** skills sit in slots 1 to 8. Each slot shows the skill's state (casting, recovering, recharging) and how long it has left.
- **Skills come from your gear:** equip an item and its skills join your bar. Your equipment covers the head, shoulders, torso, legs, belt and two weapon sets you can swap between, and it is saved between sessions.
- **Energy:** skills cost energy, which regenerates over time. Arrows next to your health and energy bars show at a glance whether they are going up or down, and how fast.
- **Targeting:** you fight with a target, not an aim reticle. The game picks the enemy closest to where you look, and you can lock it. Skills are always cast on your current target.
- **Fireball:** the fire wand's skill throws a fireball that costs 15 energy, takes a second to cast and recharges in 3 seconds. Once cast, it cannot be dodged: it arcs to its target and hits for 50 damage.

## Controls

| Input | Action |
| --- | --- |
| 1–8 | Use a skill |
| Tab or W | Lock the current target |
| I | Open the gear panel |
| T | Swap weapon sets |

## Status

The groundwork is in place: characters, health and energy, targeting, equipment, damage and the full match loop. What is missing is content. There is one weapon and one skill so far, and no professions yet, so the next step would be more gear and skills to fill the bar and give each player a role.

For the design and the code behind it, see the blog post listed below.
