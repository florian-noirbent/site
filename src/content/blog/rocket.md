---
title: "Rocket: Remaking My First Game for Multiplayer"
description: "The multiplayer-focused remake of my first Unity game: five weapons, an energy system and collision damage, and why I put development on hold."
date: 2013-07-29
type: devlog
tags:
  - "Unity"
  - "Prototype"
  - "Rocket"
  - "Student"
cardImage: /images/blog/rocket/rocket-menu.png
---

Here, at last, is the article on the remake of my first game that I've mentioned several times. I've put development on hold for now because of negative feedback: it simply doesn't grab people. Rather than keep investing time, I stopped before simplifying the gameplay so much that it lost its appeal. My testers still can't manage to get their rockets off the ground.

Unlike the first version, which was mostly single-player, this one focuses on multiplayer, with the solo mode meant only as a series of tutorials to prepare the player. The original game, now more than two years old, is still available in [my third article](/blog/first-game).

![Main menu of the Rocket remake, with Play, Multiplayer, Options and Quit buttons](/images/blog/rocket/rocket-menu.png)

I finally found someone who could actually play it, so here's a video:

<iframe src="https://www.youtube-nocookie.com/embed/wN61hV49Arg" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The Game in Brief

The player controls a rocket with a temporary boost that increases thrust for as long as the key is held, at the cost of energy. That part hasn't changed since the first game. The weapons, however, have evolved a lot. The player has five of them:

- A continuous **laser** that hits instantly at long range and deals a small amount of damage.
- **Bombs** that are affected by gravity, inherit the rocket's velocity when fired, and deal heavy damage.
- A **shield** that must be held down and protects the rocket from frontal fire.
- A fourth weapon, not implemented yet, meant to be very close to the only weapon of the **first game**: a relatively slow projectile that ignores gravity and doesn't depend on the rocket's velocity.
- The rocket's exhaust **flames**, intended as a close-combat weapon.

The combat system differs from the first version in two big ways. Weapons now consume energy, so players have to balance mobility against firepower. And violent collisions now deal damage, which discourages flying into the scenery at high speed and also turns ramming into a weapon.

For now there's only a free-for-all deathmatch mode. There is no hard player limit, but since the host is also a player (the server runs on one of the players' machines, which has to simulate the game and relay everything to the others), I'd expect performance to degrade somewhere above 15 or 20 players. The most I could test was 4.

There are two maps, both at the prototype stage: one for two or three players (the first one in the video), and one for four to six players (the second one), which was also designed with team deathmatch in mind.

## What's Next?

Development is paused, but unlike the first game, the code is well structured and documented, so I can easily pick it back up if I find a solution to the game design problem. I'll try to get in touch with a (real) game designer to hear their take. I'm afraid, though, that the only fix is to cut the gameplay down even further: most of my testers wanted me to remove gravity and inertia entirely and let the rocket move backward and strafe. In other words, they wanted a top-down shooter. I think the core problem is the initial difficulty. A phrase that comes up often in game design is "easy to learn, hard to master", and right now Rocket is hard to learn.

I'm tempted to finish it anyway. The engine and the interfaces are done, and what's left is polishing it into a decent Kongregate game (maybe it would find its audience there after all): texturing the maps, improving the effects, adding a tutorial, adding team deathmatch and capture-the-flag modes, and finishing the master server integration. But projects like this are subject to the [90-90 rule](http://en.wikipedia.org/wiki/Ninety-ninety_rule): the first 90% of the work takes 90% of the time, and the remaining 10% takes the other 90%. I expect finishing it would take a lot of time, so it may not be worth the effort.
