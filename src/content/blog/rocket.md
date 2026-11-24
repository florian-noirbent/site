---
title: "Rocket"
description: "Finally, Here is the article to introduce the remake of my first game that I mentioned several times. I have stopped the development for now because of the negative feedback: it…"
date: 2013-07-29
type: devlog
tags:
  - "Unity"
  - "Prototype"
  - "Rocket"
  - "Student"
---

Finally, Here is the article to introduce the remake of my first game that I mentioned several times. I have stopped the development for now because of the negative feedback: it don't really interest peoples, so I decided to not commit more time on it, I could excessively simplify the gameplay until loosing it's interest, my testers are still unable to fly off their rockets.

unlike the first version which was mainly solo, this one is more about multi as the solo should only be a tutorial series to prepare the player. The first version, which now is more than 2 years old, is still available in my [3rd article](/blog/first-game).

I finaly managed to find someone able to play it, to make a video:

<iframe src="https://www.youtube-nocookie.com/embed/wN61hV49Arg" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## In short:

The player control a rocket, which as a temporary boost increasing it's power as long as it's holded, but it need energy, this asn't change since the first game. However the weapons did evolve a lot, the player as 5 "weapons":

- A continuous **laser**, that give direct long range shoot and deal a small amount of damage.

- **Bombs** subject to gravity and inherit the speed from the rocket at the shoot time and deal heavy damage.

- A **shield** that need to be hold to protect the rocket from frontal shoots.

- The 4th weapon as not been implemented but it's supposed to be very close to the unique weapon of the **first game**: a relatively slow projectile, not subject to gravity and not depending on the rocket velocity.

- The rocket's propulsion **flames** should be a close combat weapon.

Two big differences from the first version in the combat system is that now weapons use energy, so the player need to balance it's style between mobility and fire power and now the violent collisions deal damages, which force to not use the decor at high speed, and this can also be used as weapon.

There is yet only a FFA deathmatch mode, there is no limit on the number of player, but since the host is a player, one can guess that above 15 or 20 players playing conditions decrease (the maximum I could test was 4).

There is 2 maps: one 2 or 3 players, the first in the video and another for 4 to 6 players, the second, which was also built with team deathmatch in mind, they are just at a prototype stage.

## What next ?

I paused the development, but unlike the first game, the code is well structured and documented, so I could easily jump in at any moment if I find a solution to the game design problem. By the way, I'll try to contact a (real^^) game designer so I could hear its thought about it, but I'm afraid the only solution is to slaughter the gameplay even more, most of my testers wanted me to completely remove gravity and inertia, and that the rocket could move backward and strafe, IE they wanted a top-down shooter. I think the core problem is the initial difficulty, a phrase that come often when talking about GD is "easy to learn difficult to master ".

I hesitate to finish it anyway: the engine and the interfaces are done, only left to work out the detail to make it a "Kongregate" nice game (maybe it would find it's public after all). only left map texturing, enhance the FX, add a tuto, make a TDM and CTF mode, and finish the master server integration, but in this kind of production there is the "[90-90](http://en.wikipedia.org/wiki/Ninety-ninety_rule)" rule involved :), and I'm expecting a lot of time to actually end it, so maybe it don't worth the trouble.
