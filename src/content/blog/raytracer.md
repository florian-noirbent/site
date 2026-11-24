---
title: "Raytracer"
description: "I'll go in chronological order and present your my first working project, scholar, having a distant relationship with video games, it is a raytracer written in C, it's a 3D…"
date: 2013-04-23
type: technical
tags:
  - "Epitech"
  - "C++"
  - "Student"
cardImage: /images/blog/raytracer/RT1.png
---

I'll go in chronological order and present your my first working project, scholar, having a distant relationship with video games, it is a raytracer written in C, it's a 3D rendering engine, that actually taught me more about making a physics engine than making a "true" rendering system for real-time purpose (because of all the collisions stuff), but I don't dismiss the idea of a raytraced game, especially with CUDA or openCL (libraries allowing to execute code on the GPU, i'll come back on my first step on that in an upcoming -far- articles). This project was similar to another one I made just before this one, and that i chose not to devote an article, a little raycasting application working in real time rendering a maze where you can walk freely, in the spirit of Wolfenstein 3d, the difference between that and the raytracer was that it throw the ray only horizontally and confront them to a 2d array instead of equations.

I couldn't find screenshot of mine, and couldn't recompile it either (it was working on a 32 bit linux and with a special graphic library from my school), here is a borrowed image to illustrate the output of a raytracer:

![Rt](/images/blog/raytracer/Rt.jpg)

My raytracer handled: lightning, shadow, reflection, refraction, "brute force" anti-aliasing, direct shadow on simple geometric form: sphere, cone cylinder, plan and some procedural textures. It would have takken 30 seconds to render the image above, it's complexity being quadratic on the number of object and the number of lights (it mean that each element added multiply the rendering time) and it's linear on the number of pixel to display, which mean that if we want a image 2 time bigger, it ll take 2 time longer to render.

## How does it works ?

Quickly, because there is already tons of sites describing it, starting by wikipedia, and because the purpose of this blog is video games:

For each pixels of the future image, we generate a virtual vector, going from the camera position to the focal plan on the pixel we want to render, we extends this vector on the form of ray (that's why it's called "raytracer"), then we test the collision between every object of the scene (can be optimized, of course) which are represented by equation, in this case, resolve the collision is about resolve a system of 2 equations, one for the ray, one for the objects, and results most of the time in second degree equation, the discriminant tel us if there is collision or not. "discriminant = b² - 4ac". if you remember your math lessons.

in the first place, we just return the value of the intercepted object, and we get this result:

![RT1](/images/blog/raytracer/RT1.png)

then we calculate the normal at the impact point of the ray (for example, the sphere's is just the subtraction of the impact point minus it's center) , and then the scalar product between the light and the normal (do not forget to normalize the vectors) give us a lighting value:

![RT2](/images/blog/raytracer/RT2.png)

That's the idea, to implement the other features, it's just about making ray bounce between objects in a recursive way, every time getting collisions point and normal and cast ray to light too, to make sure we are not "shadowed". I'll leave you to the internet if you want to know more about it.
