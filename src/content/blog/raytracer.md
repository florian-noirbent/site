---
title: "Writing a Raytracer in C"
description: "My first major Epitech project: a raytracer in C with lighting, shadows, reflection and refraction, and a quick look at how ray-object intersection works."
date: 2013-04-23
type: technical
tags:
  - "Epitech"
  - "C"
  - "Student"
cardImage: /images/blog/raytracer/RT1.png
---

I'll present my projects in chronological order, starting with my first substantial one. It's a school project with only a distant link to video games: a raytracer written in C, which is a type of 3D rendering engine. It actually taught me more about building a physics engine than about real-time rendering, because so much of it is collision detection. Still, I haven't given up on the idea of a raytraced game, especially with CUDA or OpenCL, which let you run general-purpose code on the GPU. I'll write about my first steps with those in a (much) later article.

Just before this, I built a similar project that doesn't deserve its own article: a small real-time raycaster that renders a maze you can walk through freely, in the spirit of Wolfenstein 3D. The difference is that a raycaster only casts rays horizontally, one per screen column, and tests them against a 2D grid instead of solving equations for 3D objects.

I couldn't find any screenshots of my raytracer, and I can't recompile it either (it ran on 32-bit Linux with a graphics library specific to my school), so here is a borrowed image to show what a raytracer produces:

![Example raytraced scene with reflective and refractive objects](/images/blog/raytracer/Rt.jpg)

My raytracer supported lighting, shadows, reflection, refraction, brute-force anti-aliasing (supersampling: casting several rays per pixel and averaging them), simple geometric primitives (spheres, cones, cylinders and planes) and a few procedural textures. An image like the one above would have taken about 30 seconds to render.

Without any acceleration structure, the cost per pixel grows with the number of objects multiplied by the number of lights: every ray is tested against every object, and every hit point casts a shadow ray toward each light, which is again tested against every object. The total time is also linear in the number of pixels, so an image with twice as many pixels takes twice as long to render.

## How It Works

I'll keep this brief, since plenty of sites already explain it in detail (Wikipedia is a good start) and this blog is about video games.

For each pixel of the final image, we build a vector from the camera position through that pixel's position on the focal plane. We extend this vector into a ray (hence the name "raytracer") and test it for intersection against every object in the scene. This can of course be optimized.

Each object is described by an equation, so finding an intersection means solving a system of two equations: one for the ray, one for the object. For spheres, cones and cylinders, substituting the ray's equation into the object's gives a quadratic equation in the distance along the ray. As you may remember from math class, its discriminant, `b² - 4ac`, tells us whether there is a hit: negative means the ray misses, otherwise the smallest positive root gives the nearest intersection. (A plane only needs a linear equation.)

As a first step, we simply return the color of the object the ray hits, which gives this result:

![First render: flat colors of the objects hit by each ray](/images/blog/raytracer/RT1.png)

Next, we compute the surface normal at the hit point. For a sphere, it's just the hit point minus the sphere's center. The dot product between the normal and the direction toward the light (both normalized) gives the lighting intensity at that point:

![Second render: diffuse lighting computed from surface normals](/images/blog/raytracer/RT2.png)

That's the core idea. The other features come from making rays bounce between objects recursively: at each hit point, compute the collision point and normal, then cast a ray toward each light to check that nothing is in the way (otherwise the point is in shadow). Reflection and refraction spawn new rays in the reflected or refracted direction. If you want to go further, the internet has everything you need.
