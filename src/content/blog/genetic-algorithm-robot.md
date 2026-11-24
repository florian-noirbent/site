---
title: "Evolving a Robot's Movement with a Genetic Algorithm"
description: "A school project in C#: a genetic algorithm teaches a two-wheeled robot with one arm to drag itself forward in the anyKode Marilou simulator."
date: 2015-10-05
type: technical
tags:
  - "AI"
  - "C#"
  - "Genetic algorithm"
  - "Robotics"
  - "Machine learning"
  - "Student"
---

A genetic algorithm is one of those techniques that sounds almost too simple to work: generate random solutions, keep the ones that do slightly better, mix them together, repeat. I built one for a school assignment last year, and the result is a small simulated robot that learned to move on its own. The video shows it in two parts: the first 30 seconds are the first generation, the last 30 seconds are the same robot after 50 generations.

<iframe src="https://www.youtube-nocookie.com/embed/E1l4LWE8zE8" title="Genetic algorithm robot" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The assignment

When I arrived in China, I wrote about [an idea for a game where AIs design and fly their own block-built ships](/blog/china-and-new-projects), improving through a genetic algorithm. At the time I admitted I had no idea how to evolve a *behavior* rather than a shape, and that is mostly what kept me from starting the prototype. Since then, Robocraft has come out with a very similar building concept, minus the evolving AI.

This project answered that question on a much smaller scale. Our teacher gave us a robot with two free-spinning wheels and one motorized arm, along with an API to control the arm. The goal: write a program that makes the robot move as fast as possible using only that arm. The wheels are not powered, so the only way forward is for the arm to push, pull or tip the body in a useful rhythm. Finding that rhythm by hand would be tedious; letting it evolve is much more fun.

The robot lives in [anyKode Marilou](https://en.wikipedia.org/wiki/AnyKode_Marilou), a physics-based robotics simulator. My program is a C# console application that talks to the simulation through Marilou's MODA API.

## Talking to the simulator

The arm has three servo motors: shoulder, arm and finger. The program connects to the simulator on `localhost`, starting at port 13000, queries the robot, and grabs the three servos plus the base plate, whose position gives me the distance traveled.

The connection code loops over successive ports (13000, 13001, ...) and creates one `Robot` per simulator instance it finds. A small `RobotManager` hands robots out to individuals and takes them back when an evaluation is done, guarded by a mutex. The idea was to run several Marilou instances side by side and evaluate a whole generation in parallel with a thread pool. That code is still in the repository, but commented out: in the version that shipped, individuals are evaluated one after another.

## Encoding a movement as a genome

The genome is a short program: a sequence of 2 to 5 **actions**. Each action is four integers:

- a target position for the shoulder servo (250 to 790),
- a target position for the arm servo (200 to 750),
- a target position for the finger servo (400 to 1024),
- a delay before the next action, between 300 and 1000 milliseconds.

To evaluate an individual, I reset the simulation, record the robot's starting position, and then replay its sequence in a loop: send the three servo targets, wait for the delay, move to the next action, and start over at the end of the sequence. This runs for 20 seconds of simulated time.

Because the sequence loops, the algorithm is effectively searching for a gait: a cycle of arm poses and timings that, repeated, pushes the robot forward.

## Fitness

The fitness is simply the distance the base plate traveled along the X axis during those 20 seconds. Going backwards gives a negative score, so a robot that crawls the wrong way is worse than one that does nothing.

This is the simplest possible measure. Individuals that survive into the next generation are evaluated again, and a physics simulation does not always reproduce a run exactly, so each individual also remembers its best distance ever, separately from its latest one.

## Selection, crossover and mutation

The population has 100 individuals. After each generation is evaluated and sorted by distance, the next one is built like this:

- **Elitism**: the best individual of the generation is copied as is, along with the individual with the best distance ever recorded, so a good run is not lost if a re-evaluation goes worse.
- **Selection**: parents are picked with a rank-based falloff. The individual ranked *i* gets a weight of 100 − *i*, so the best one is a hundred times more likely to be picked than the worst, but even poor individuals keep a small chance to reproduce. This keeps some diversity without ignoring the ranking.
- **Crossover**: the two parents are put in random order, then the child takes the beginning of the first parent's sequence, up to a random cut point, followed by the end of the second parent's sequence, from another random cut point. Since the two cuts are independent, children can be longer or shorter than their parents: the length of the movement evolves too.
- **Mutation**: with a 5% chance, one random action in the child is replaced by a brand new random action.

The first generation is entirely random, and most of those robots just twitch in place. A handful happen to move a tiny bit, and that is all the algorithm needs to get started.

## Watching it learn

Each generation, the program prints the best and average distance to the console and appends them to a data file. It also pipes a `plot` command to gnuplot so the two curves update live while the evolution runs. When the average gets close to the best, the whole population has converged on roughly the same way of moving.

The population is also saved to a text file after every generation, one line per individual and one comma-separated group per action, so a run can be stopped and resumed later. That matters when each generation takes 100 evaluations of 20 simulated seconds.

After a few dozen generations, the robot moves remarkably well, as the end of the video shows. The project was graded on a grid covering the main loop, knowledge representation, fitness, selection and crossover, fine-tuning, whether it works, and advanced evolution techniques, and I finished at the top of my class for this module.

## What I would do differently

The weakest point in the grid was "advanced evolution", and I have read about several techniques since that would help here. The main one is **islands**: several populations evolving independently, with occasional exchanges of individuals between them. Another is a geographic distribution of individuals, where each one can only mate with its neighbors. Both aim at the same thing: slowing down convergence, so the population does not settle too early on one decent gait and keeps improving for longer.

Evaluating each individual several times and averaging the results would also make the fitness more robust, at the cost of a slower run.

In the same machine learning course, we also built artificial neural networks for handwriting and captcha recognition, trained with backpropagation. A genetic algorithm could train a neural network's weights just as well, and that combination, an evolved network driving the robot from its sensors instead of a fixed looping sequence, is the natural next step. It is also exactly what my old space-ship idea would need.

## Links

- Source code: [GeneticAlgorithmRobot on GitHub](https://github.com/florian-noirbent/GeneticAlgorithmRobot)
- The original game idea: [A Year in Beijing and New Projects](/blog/china-and-new-projects)
