---
title: "A Year in Beijing and New Projects"
description: "Starting a school year at Beijing Jiaotong University, wrapping up the voxel engine, and an idea for evolving AI spaceships built from blocks."
date: 2013-09-01
type: devlog
tags:
  - "AI"
  - "Beijing Jiaotong University"
  - "Student"
cardImage: /images/blog/china-and-new-projects/bjtu.jpg
---

I'm starting a new school year at Beijing Jiaotong University. I chose every course on computer graphics and game development, plus the ones on software project management. Since YouTube is blocked here, I also need to move my videos, or at least mirror them on Youku. (Edit: done, [my Youku channel is here](http://i.youku.com/u/UMTI4NjEwNzM2MA==).)

![Beijing Jiaotong University campus](/images/blog/china-and-new-projects/bjtu.jpg)

## The voxel engine

I'll write one last article about my voxel engine to show the latest updates. As I said in the first article of the series, it was meant to be a small experiment, and I'm surprised by how much time and complexity it ended up taking. I'll keep working on it, but only occasionally.

In the coming weeks I'll share my new school projects, as well as two others: an amateur team project I joined a few months ago and contribute to (a multiplayer space opera in the vein of X Rebirth), and my end-of-studies project, which is slowly getting started (a first-person runner like Mirror's Edge).

That doesn't leave much room for a voxel engine right now. Besides, as I mentioned, I wanted to run other experiments, this time on emergent behavior, which will probably not end up as a polished product. The idea is taking shape as a space shooter with procedurally built ships. It should reuse most of the voxel engine, and it will also give me a chance to prototype some ideas for the team project.

## An experiment in emergent behavior

Here is the concept. Players build their ship out of blocks, like in a Lego game, then fight other ships. The first ship to take damage to its core explodes. Each shot destroys part of the ship depending on the resistance of the blocks it hits. Ships are flown in third person, and during the build stage the player binds hotkeys to weapons and engines.

Each ship has a budget and each piece has a cost. Every piece also has a mass, so the center of gravity matters. Players will have to manage their power balance with [a capacitor system like the one in EVE Online](https://wiki.eveonline.com/en/wiki/Capacitor), which can be extended with extra battery blocks that are fragile and explosive. I also imagined conductive blocks that route power from the batteries to the weapons and engines, like Minecraft's redstone, so those links could be severed in a fight. Players could spend a long time designing their ship, but how many of these features make it in depends on how much time I can give this idea. I'd also love ships to launch drones that the player programs during the build stage, either in a high-level language through an API or with a node-based interface, as in Colobot. But I'm getting carried away.

This could already be a fun multiplayer concept, but what interests me most is building an AI that designs its own ship and improves it based on wins and losses, using a genetic algorithm. The idea behind a genetic algorithm is to treat each design as a "genome", let a population of designs compete, keep the best ones, and combine and randomly mutate them to produce the next generation. Here it would work on two fronts: the shape of the ship and the way it is flown.

Lack of time aside, there are several problems I still don't know how to tackle:

- **Procedural moving colliders.** So far my mesh-based colliders were static, since they were built for terrain. A moving object needs a completely different approach.

- **Gameplay.** My Rocket project showed me that this kind of control is really hard for players to master, and I'm afraid the result would be messy and frustrating. To some extent that's not a big deal, since the main goal here is the AI, but if it's fun for humans too, that's a huge bonus.

- **Evolving behavior.** Evolving the ship's shape with a genetic algorithm sounds easy enough, but evolving how it is flown looks much trickier. I need to read up on this.

- And of course, I need to finish the parts of the voxel engine I'll be reusing.

Edit, December 1st 2013: I'm keeping this idea on the shelf for now. In the meantime, [an article on evolving behavior with genetic algorithms](http://www.gamedev.net/page/resources/_/technical/artificial-intelligence/light-introduction-to-genetic-programming-r3401) came out that I found really interesting and that deserves a mention here. [Space Engineers](http://www.spaceengineersgame.com/) was also released, and it uses many of these ideas, minus the AI part.
