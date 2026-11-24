---
title: "Vehicle Shifter: My First Ludum Dare Compo"
description: "My Ludum Dare 35 entry on the theme Shapeshift: a car that turns into a rocket, built solo in Unity in about 20 hours, with an online leaderboard."
date: 2016-04-17
type: devlog
tags:
  - "Vehicle Shifter"
  - "Ludum Dare"
  - "Game jam"
  - "Rocket"
  - "Unity"
  - "Physics"
---

This weekend I took part in Ludum Dare 35, my first Ludum Dare compo. The theme was **Shapeshift**, and my entry is **Vehicle Shifter**: a time-attack game where you drive a car that can turn into a rocket at any moment, and back again.

<iframe src="https://www.youtube-nocookie.com/embed/n9jAfT_nA84" title="Vehicle Shifter, Ludum Dare 35" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Ludum Dare in a Nutshell

Ludum Dare 35 ran over the April 15th-18th weekend. The event has two tracks. The **Compo** is solo, from scratch, with source code, in 48 hours. The **Jam** is more relaxed: 72 hours, solo or in a team. I went with the Compo. After the deadline, participants spend three weeks playing and rating each other's games across categories like Fun, Innovation, Theme, Graphics and Audio, and you need to rate other games to get ratings yourself.

## The Game

You get through a level as fast as possible, switching between two vehicles:

- **W/S** (or Z/S, or up/down) controls the power output.
- **Q/D** (or A/D, or left/right) controls the balance.
- **Shift** transforms the vehicle between the car and the rocket.

Each transformation gives you a push: a vertical impulse when you shift into the rocket, a horizontal one when you shift back into the car. Chaining them well is how you shave seconds off your time. Some players prefer to drive the car forward with the right key and balance it with up and down, so a checkbox in the bottom-right corner swaps the axes, though shifting to the rocket gets harder that way.

Your best time goes to an online leaderboard once you set a username, so you can compare yourself with other players.

## How the Weekend Went

The whole thing took about 20 hours of work.

**Saturday, 8:30.** I started with the theme. My first idea was a fighting game where you transform into a werewolf, but that meant far too much art for one person in 48 hours, so I dropped it. That led me to a "Transformers" idea with three forms: a car, a plane and a mecha. The car and the plane would explode at the slightest mistake, while the mecha would be slow but invincible, meant for the hardest sections. After about an hour and a half of thinking, I started coding.

**By lunch** I had a working car and the beginnings of a rocket. The rocket replaced the plane because I'm a fan of rockets: [my first game](/blog/first-game) was about flying one, and so was [its multiplayer remake](/blog/rocket). Vehicle Shifter reuses that concept. The first playtest changed the design right away: the controls were already too hard for me to also punish mistakes, so I gave up on vehicles that blow up. Without that, the mecha lost most of its point, and since it would also have been the hardest to model and animate, I set it aside.

**Then came four hours of struggle.** Switching vehicles didn't work. The car and the rocket have different colliders, and swapping one for the other in place made the player fall through the map, get bumped away or get stuck in the geometry. I tried several approaches before finding one that held up: the new vehicle spawns with a collider at 50% of its size and grows back to full size over one second. That solved the physics, but the rocket still crashed immediately after a shift and the car started too slowly. The fix for that was the impulse on each transformation, which ended up being the core of the gameplay.

**Level design** took the rest of the afternoon, about two hours, and exposed a balance problem. The rocket was too strong: while testing, I had no reason to ever switch back to the car, and meanwhile my testers couldn't even get moving. I solved it by greatly increasing the rocket's air drag. Less inertia makes it much easier for beginners to control, and it also lowers the rocket's top speed below the car's, so each form has a reason to exist. That is also why the rocket feels so heavy.

**After dinner** I built the menu and the leaderboard. For the leaderboard I used [dreamlo](http://dreamlo.com/), a free hosted leaderboard service that is very poorly referenced: I had seen people mention it on a forum, couldn't find the site, and almost gave up thinking it was dead. By the end of the first day the game was fully functional, built from cubes and cylinders, with an ugly menu.

**Sunday morning** went to the "artistic" side: modeling, textures, lighting, font, sound and menu layout. I spent the afternoon testing, rebalancing, reworking the level design and publishing.

## Tools

- **Unity** with the **ProBuilder** plugin for level design and modeling, directly in the editor
- **dreamlo** for the online leaderboard
- **sfxr** for the sound effects
- **Paint.NET** for the textures

## First Feedback

The comments so far agree on one thing: the controls are hard to figure out. Several players said the swap between car and rocket wasn't obvious and took a while to learn, one found the car's rotation too sensitive, and one suggested an in-game tutorial showing how shapeshifting works. They are right. The controls are only explained on the entry page, and I should have displayed them in the game. On the positive side, people liked the lighting, the visual style and the physics once they got the hang of it, and a few were surprised to find a working online leaderboard in a 48-hour game. One player summed up the rocket as the heaviest they had ever seen in a game. It is full of fuel.

It's a familiar lesson. My Rocket remake stalled because it was hard to learn, and I just made a game whose biggest weakness is, again, the learning curve. The difference is that a jam surfaces it within days, from dozens of players who have never seen the game before.

## Update: Results

Judging is over. Vehicle Shifter finished with an overall score of 3.00 (#636), Its best placement was Humor (#341, 2.55), and Graphics came next (#428, 3.11). The rest: Mood #562 (2.77), Theme #589 (3.18), Innovation #603 (2.89), Fun #627 (2.89), and Audio, the lowest score at 1.92 (#614). One player pointed out that better audio could have done a lot for the mood, and the numbers agree.

## Play It

The game is available as a WebGL build, a Windows build and the full source code, all linked from [the Ludum Dare entry page](https://web.archive.org/web/2017/http://ludumdare.com/compo/ludum-dare-35/?action=preview&uid=19671) (archived copy). Because support for Unity's Web Player has been dropped, I can't embed my games directly in my articles the way I used to, and I can't easily rebuild my older projects for WebGL either: most games from the Unity 3 era don't upgrade well to Unity 5, between different physics behavior and many API changes.
