---
title: "Pathfinding, End-of-year project – part 3"
description: "Let's end the end-of-year project's series with the AI I made for the monsters, more especially the pathfinding (finding the shortest path to a destination, maybe in a maze).…"
date: 2013-05-25
type: technical
tags:
  - "Epitech"
  - "C++"
  - "XNA"
  - "End-of-year project"
  - "Xbox"
  - "Pathfinding"
  - "AI"
  - "Student"
---

Let's end the end-of-year project's series with the AI I made for the monsters, more especially the pathfinding (finding the shortest path to a destination, maybe in a maze).

## Example of A\*

The method I used is a bit away from the usual [A\*](http://en.wikipedia.org/wiki/A*_search_algorithm), that I invite you to document yourself if you do not know it yet, since it's the most used today; to quickly resume it : It's a recursive algorithm that, to simplify, try to make straight line path until it find an obstacle, if one is found,we look at the closest path by going up through the graph and always evaluate the node with the smallest cost (current + straight line).

![](http://upload.wikimedia.org/wikipedia/commons/5/5d/Astar_progress_animation.gif)

This allow to have multiple elements (agent) moving to different destination, with potentially different constraint, for example in a military game, a tank might ignore some node while infentery'll acess to every ones, this avoid the predicament where a tank controlled by an AI try to pass through a door :).

But the A\* as 2 major drawback that made me find another solution:

- each agent compute it's own path, which lead to a linear complexity based on the number of element, IE, if you double you monsters number, you double compute time, in this project I wanted a huge amount of monsters that all have the same destination, so it would have be a waste of resources.

- each agent move without considering the other agents, so it gives huge collision problems, you have to fix this by implementing a "collision avoidance" system, which result in a complexity at best in *log(n) \* n *and at worst it will become quadratic, depending of what you decide. But even with this the agents stay "selfish".

## Collaborative diffusion

I implemented [Collaborative Diffusion](http://scalablegamedesign.cs.colorado.edu/wiki/Collaborative_Diffusion), here's the result it give me:

- A nearly constant complexity, IE the compute time to move every monsters is (almost) independent of there number, so I can have as many monsters as I want

- A "group behavior": my monsters don't just stupidly follow one behind the other, they try to surround the player, to block every path, they split to attack every players, etc

The drawback is that I lost the flexibility of A\*, the benefits I have outlined, but for this game, they where useless, there is no perfect solution working in every scenario, with each new project I need to reevaluate every possibilities in the new context.

## How does it work ?

To make it simple, each player diffuse a "smell" on the map, it's stopped by blocking cells, and reduced by slowing cells, each monsters then just have to follow the highest value to find the player. Then the monster reduce the smell value of it's square so if another monster follow him, it will choose to take a different "free" path, the reduction value determine the size of the detour the "following" monster is willing to take to avoid to follow it's predecessor.

Here is a illustration of this implementation on a pac-man, the smell diffusion is yellow.

![](https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQbsaE54STX_8Tj6sUJXQpm2JVzGmfUUTVGSZ84TG2Hm029qqCS)

## Optimizations

It sound simple, it is, but there is still some imperative optimization:

- For a pac-man, you can afford to refresh the whole map, but for a huge world, like the one I made with maps bigger than 5 millions tiles, it's out of question, you have to decide of a compute zone, in which your make your smell computation. In my end-of-year project it's 50 by 50, which mean any monster away from 25 squares from the player will stop, this correspond precisely to their "standby" distance.

- The array must not be cleaned and recomputed every frame with a recursive algorithm, you should use assumption that the map will evolve slowly from one iteration to the next and rotate between 2 array, changing the value of each cell base on it's surrounding cells, which again avoid explode complexity based on diffusing agents numbers, so each agent only update it's current square, and it's passed to the rest of the map through the next iterations.

and there is some other optional optimization:

- You don't necessarily iterate each frame, you only need to have a refresh rate higher than the time it take to an agent to move to another square, so in my game 5 time by second are enough to have a correct result.

- The second optimization we discussed allow parallel computation, you should have immediately thought about GPGPU, I didn't done it my game because I already had excellent result, but using CUDA (or openCL) should allow to refresh millions of cells each iteration.
