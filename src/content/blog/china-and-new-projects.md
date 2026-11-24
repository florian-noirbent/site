---
title: "China and new projects"
description: "I'm starting a new school year at Beijing Jiaotong university, I chose to follow all courses about \"computer graphics\" / \"game developement\" and those about software project…"
date: 2013-09-01
type: devlog
tags:
  - "AI"
  - "Beijing Jiaotong University"
  - "Student"
cardImage: /images/blog/china-and-new-projects/bjtu.jpg
---

I'm starting a new school year at Beijing Jiaotong university, I chose to follow all courses about "computer graphics" / "game developement" and those about software project management. By the way I need to move the host of all my videos, or at least have a miror on Youku since youtube is not available here. (edit: voilà, it's done, [my Youku channel is here](http://i.youku.com/u/UMTI4NjEwNzM2MA==)).

## ![bjtu](/images/blog/china-and-new-projects/bjtu.jpg)

About my voxel engine, I'm going to make one last article to show the last updates. As I mentioned in the first article of this series, the purpose was to run a small experiment, I'm somewhat surprised about the time and the complexity this took, I'll still work on it, but occasionally.

In the upcoming weeks, I'll share my new scholar projects, and also an amateur team project that I joined few month ago and contribute to develop (a multiplayer space opera like X rebirth) and also my end-of-study project which is starting slowly (it's a first person runner like mirror's edge).

So this don't leave much room for a voxel engine right now, moreover I wanted to run other experiment as I said, on emergent behavior, which will likely not end with a polished result. This idea begin to take shape in a space shooter game where the ships are procedurally generated, this should reuse most of the voxel engine and should also give me the opportunity to prototype some of my ideas for the team project I joined.

## Experiment about emergent behavior

To dwell a bit on this idea right now, The principle would be that a player build it's ship with blocks like in a Lego game, then fight other ships, the first one to receive damage to it's core would explode, each shoot would destroy some part of the ship depending of their resist, the ship should be controlled in third person, and the player would have bound some hotkeys to weapons and engines in the build stage.

Each ship will have a budget and each piece a cost. The gravity center will be considered and each piece would have a mass. The player will also need to consider power balance with [a capacitor system like the one in EvE online](https://wiki.eveonline.com/en/wiki/Capacitor), which could be increased with additional batteries (a block) that would be fragile and explosive. I also imagined a conductive block to route the power from batteries to weapons, engines, ... like the minecraft redstone, so the link could be broken in a fight. Actually, the player could think about its ship for a while, but all these feature will depend on the time I can afford to spend on this idea. I also would like the ships to throw drones that would be programmed by the player in an high level language with an API or with a nodal interface at the build stage, like colobot, but I'm starting to dream too much^^.

This could already be a fun concept for multiplayer, but the thing that would interest me the most about it would be to make an AI that would build its ship itself and evolve it depending on win and loose, with a genetic algorithm that would work in two ways: the shape of the ship and the driving.

Let alone the lack of time, before starting this project I still need to solve some problems that I don't know yet how to tackle:

- The procedural mobile collider: until now the colliders, mesh based, where statics (since it was for a terrain), for a moving object this need to be completely different.

- The gameplay: I've seen in my Rocket project that this kind of control are really hard to take in hand for a player and I'm afraid that the result would be a messy and frustrating gameplay. In a certain extant, this is not dramatic because the purpose of this would mostly be about AI's, but if it can be fun for a human, it's a huge bonus.

- As a genetic algorithm evolving the ship shape sound easy to me, as evolving the behavior sound a bit more tricky, I need to more document myself on this area.

- And of course I need to finalize the voxel engine's part that I'll need to reuse.

edit December 1st 2013: I'm keeping this idea for now, here is [a related article published meanwhile](http://www.gamedev.net/page/resources/_/technical/artificial-intelligence/light-introduction-to-genetic-programming-r3401), about evolving behavior with genetics algorithm that really interested me, I thing it should be mentioned here. meanwhile [space engineers](http://www.spaceengineersgame.com/) was also released, it use a lot of these ideas, without the artificial intelligence part.
