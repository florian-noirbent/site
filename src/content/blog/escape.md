---
title: "Escape: A Puzzle Game Prototype"
description: "Escape, a Unity puzzle prototype made with e-artsup students for a game design module: guide a ball to the exit with objects whose behavior a trigger switches."
date: 2013-05-18
type: devlog
tags:
  - "Escape"
  - "Unity"
  - "Prototype"
  - "Epitech"
  - "Student"
cardImage: /images/blog/escape/illustration.webp
---

This time it's a current project, since I presented it just last week. It's called "Escape", a prototype I made for a game design module. This was the first year the module ran, and I wasn't going to miss it; I hope the school keeps it for future students. The project was a collaboration with e-artsup, an art and design school. Our group brought together three second-year e-artsup students, first-year Epitech students, and me, in my third year. Unlike my [end-of-year project](/blog/end-of-year-project-part-1), which was graded on purely technical criteria, this one was about game design: the goal was to come up with an innovative concept, iterate on the gameplay and polish the look.

![Illustration of an Escape level: a steel ball falls from a copper pipe onto a rusty riveted wall of brass triangles, metal cubes and purple teleporters, with the green trigger glowing in the middle and the exit pipe at the bottom right](/images/blog/escape/illustration.webp)

## The game

Escape is a puzzle game. A ball comes out of an entry pipe, and the player has to guide it to an exit pipe. To do that, the player has an inventory of objects to place along the ball's path, and must also deal with the objects already placed in each level. On top of that, every level has a trigger. The ball must touch it at least once for the exit pipe to open, and each time it does, the trigger switches between green and red, which changes how the objects behave.

The prototype has three objects:

- **Triangle:** the ball bounces off it when the trigger is green and rolls along it when the trigger is red.
- **Cube:** recenters the ball and sends it off at a right angle, whatever the trigger's state.
- **Teleporter:** moves the ball between its two portals when the trigger is green, and does nothing when it's red.

The game has six levels, of which levels 1, 2 and 4 are tutorials. It takes about 10 to 30 minutes to finish.

Click the image to start the game. It wasn't built for the web and nothing is streamed, so the 4 MB download may take a while. It isn't translated either, but there is very little text: "jouer" means "play", "quitter" means "exit", "rejouer" means "replay", "niveau" means "level" and "niveau suivant" means "next level". The rest should be self-explanatory.

![Image not recovered: Escape Web Player demo preview](/images/blog/missing-image.svg)

*The original Unity Web Player demo is no longer available.*

## My role

Beyond the game design work, I taught the first-year students to program with Unity (with mixed results), and I wrote the trickiest parts of the code myself. I also made the 3D models, then handed the UV layouts to the e-artsup artists for texturing, since their curriculum only covers 3D modeling late.

*The source code of the project is archived on [GitHub](https://github.com/florian-noirbent/Escape).*
