---
title: "An HLSL Simplex Noise Library"
description: "A simplex noise library for HLSL in 1D, 2D and 3D, with analytical derivatives and a seed instead of a lookup table, built for GPU terrain generation."
date: 2013-07-15
type: technical
tags:
  - "DX11"
  - "HLSL"
  - "DirectCompute"
  - "Student"
---

I've finally chosen the method I'll use for my voxel engine. It's an algorithm of my own that keeps the advantages of working with cubes while giving much higher fidelity. I'll write about it as soon as I have something to show.

To prepare my GPGPU terrain generator, I ported the simplex noise library I use to HLSL, because I couldn't find an existing one with the features I need. Simplex noise is Ken Perlin's successor to classic Perlin noise: a smooth, continuous pseudo-random function that is cheaper to evaluate in higher dimensions, which makes it a staple of procedural terrain.

What sets this implementation apart from the others available:

- **It computes the derivatives.** Getting the gradient analytically, alongside the noise value, is much cheaper than sampling the noise several times, and it's useful for computing normals or shaping terrain based on slope.
- **It uses a seed instead of a lookup table.** It's slower, but a permutation table makes the noise repeat after a fixed period, while the seeded version doesn't repeat.
- **It works.** :)

Here is the result:

<iframe src="https://www.youtube-nocookie.com/embed/01AcTdGmA7E" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And the derivatives:

<iframe src="https://www.youtube-nocookie.com/embed/CREd_BMQfLs" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As always, I'm sharing it. Include the file with `#include "simplex.hlsl"` and call, for example, `float n = simplexNoise(float3(0, 0, 0));` from any project. I use it in compute shaders, but in theory it also works in vertex, pixel, geometry, hull and domain shaders.

There are 1D, 2D and 3D versions, each available with or without derivatives, for six function prototypes in total:

```hlsl
// one dimensionnal simplex noise:
float simplexNoise(float x);
// one dimensionnal simplex noise with an out parameter filled with the derivative:
float simplexNoise(float x, out float dx);
// ... and others version
float simplexNoise(float2 coord);
float simplexNoise(float2 coord, out float2 derivative);
float simplexNoise(float3 coord);
float simplexNoise(float3 coord, out float3 derivative);
```

The seed, `simplexSeed`, must be initialized before any call.

I'll extend the library as my needs grow and update this article when I do. Likely additions are a version that tiles over a given interval, and a 4D version for clouds, where the fourth dimension can be used as time to animate a 3D volume.

[**Source (temporary)**](http://pastebin.com/BycaHKEP)
