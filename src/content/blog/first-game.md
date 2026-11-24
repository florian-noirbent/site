---
title: "My First Game: Flying a Rocket in Unity"
description: "My first real game, built in Unity after my first year at Epitech: steer a rocket through three punishing levels, or fight a friend in two-player LAN mode."
date: 2013-04-24
type: devlog
tags:
  - "Unity"
  - "C#"
  - "Rocket"
  - "Student"
---

This is my first real game. I made it during the summer after my first year at Epitech, right after working through Kris Luro's excellent tutorials on Unity 3D France.

You pilot a rocket through a 2D level, seen from a third-person camera. One key fires the thruster, two keys rotate the rocket, and a boost multiplies the thrust for a few seconds. It sounds simple, but out of the dozen or so people I shared it with, only one got through the tutorial level and, as far as I know, nobody finished the last level. So much for the learning curve.

![Rocket flying through a level of my first Unity game](/images/blog/first-game/rocket-screenshot.png)

Here is the tutorial level, recorded in June 2011:

<iframe src="https://www.youtube-nocookie.com/embed/muYcI5bjFIM" title="First game (2011)" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The game uses only Unity's built-in primitives. The rocket, for example, is a sphere, a cylinder and two cubes, because I didn't know how to model yet.

There are three fairly long single-player levels. The goal is to get from point A to point B while avoiding balls, lasers, flames and waterfalls, and, in the later levels, outrunning rising lava.

I also added a two-player multiplayer mode over LAN, with three maps: an empty one, one with a zero-gravity bubble in the middle, and one packed with traps from the solo levels. In multiplayer, the rocket fires straight ahead from its nose, and the goal is to kill your opponent more often than they kill you, either by shooting them or by pushing them into a crash.

The game turned out to be very addictive, so I decided to reuse the concept for a new game. The code itself couldn't be salvaged: it was written haphazardly, and it's a small miracle it runs without crashing (too often). So I started from scratch on a new game with the same theme, this time with short, easy levels to start with, proper online multiplayer through a master server, and, most importantly, real 3D models. I'll cover it in an upcoming article.

If you want to try it, it's still available on the page I set up at the time *(that page is no longer online)*. You'll find this game there (18 MB, 15 of which are the unbearable music tracks you'll mute immediately), along with a tiny FPS from the Unity 3D France tutorials, a buoyancy test (making objects float) and a gameplay test for a game in the style of Star Wars podracing.
