---
title: "HLSL simplex noise library"
description: "I finally chose the method I'll use for my voxel engine, it's an algorithm I imagined, taking the advantages of cube manipulation while enhancing the fidelity, but i'll talk about…"
date: 2013-07-15
type: technical
tags:
  - "DX11"
  - "HLSL"
  - "DirectCompute"
  - "Student"
---

I finally chose the method I'll use for my voxel engine, it's an algorithm I imagined, taking the advantages of cube manipulation while enhancing the fidelity, but i'll talk about it as soon as I have something to show

To prepare my GPGPU terrain generator, I translated the simplex noise library I use in HLSL, because I didn't found one with the functionality I need.

The difference with others available implementation:

- compute the derivative.

-use a seed instead of a lookup table: slower but allow a non cyclic noise

- it's working :)

Here is the result:

<iframe src="https://www.youtube-nocookie.com/embed/01AcTdGmA7E" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

and the derivatives:

<iframe src="https://www.youtube-nocookie.com/embed/CREd_BMQfLs" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As always I'm sharing it here, one just need to include the file ("#include simplex.hlsl") to use it by calling "float n = noise2(float3(0,0,0));" in any project. It's working for compute shader (as I do) but theorically aslo in vertex, frag, geometry, hull, domain, etc...

There is 1D, 2D, and 3D in a simple version and in a version with derivative, the 6 function prototype arre:

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

The seed as to be initialized before any call: simplexSeed

I'll definitely update this librarie as I need, i'll update this article when I do, for example, I could had a version allowing cyclic output on a specified interval, and of course a 4D version to make clouds.

[**source (temporary)**](http://pastebin.com/BycaHKEP)
