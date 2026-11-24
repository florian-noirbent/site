---
title: "DX11 particle engine"
description: "I developed these days a little Dx11 particle engine on unity, mainly to learn how to use compute shader. this knowledge will allow me to make the terrain generation of my voxel…"
date: 2013-07-04
type: technical
tags:
  - "Unity"
  - "DX11"
  - "HLSL"
  - "CUDA"
  - "OpenCL"
  - "DirectCompute"
  - "Student"
---

I developed these days a little Dx11 particle engine on unity, mainly to learn how to use compute shader. this knowledge will allow me to make the terrain generation of my voxel engine. Before coming back on it, I'll quickly introduce the 2 others GPGPU methods I tried:

## CUDA

There is not much to say, it's easy and straightforward to use, I have put aside this solution to avoid an unpleasant "nvidia only" on my terrain generator. Beside for the research and very specific case, I can hardly figure out who would use this technology, no one would make an end consumer application who would ignore half of the computers.

## OpenCL

It took me several days to manage to run a test program. The syntax is heavy, while in CUDA you just call a kernel function like any C function, openCL need to select the driver, then the graphic card, compile the code then finally call the kernel with on function call by parameter it need, everything with an old school error handling. But the problems I encountered mainly came from nvidia, which provide the driver, seems to be stopping its openCL support, they have withdrawn every helper function from the API, I had to find them in the source of the older driver version, and also the most part of the documentation from its website (only left the samples).

## DirectCompute

Eventually, I chose to use compute shaders, because of their integration with Unity, before ending my choice on this, I started a .NET wrapper for openCL, but it wouldn't have allowed me to directly exchange with vertex and fragment shader without going through the CPU the way I do it with compute shaders, because of the Unity's API.

The main drawback of this is, as the title of this article said; it's only working on Dx11. However, direct3D 11 was released in 2009, so it's now a 3 years old technology which will be increasingly available. But this considerably slow down my development since only my desktop computer can run it today.

To learn, I mainly used the [Microsoft video series](http://channel9.msdn.com/tags/DirectCompute-Lecture-Series/), my C++ test worked well but when I looked at the Unity's API, I found a [completely empty documentation for a lot of function](http://docs.unity3d.com/Documentation/ScriptReference/ComputeBuffer.SetData.html). Thanks to the forums and a lot of tests, I finally managed to get a first working code. I therefore decided to release a commented package with my particle engine (at the end of this article), if it can spare you from loosing as much time than I did. The commentaries assume that my reader also don't know regular shader programming.

<iframe src="https://www.youtube-nocookie.com/embed/4eS6lyAJ4EE" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here are the first steps:

- [First moving particle](http://www.youtube.com/watch?v=k9pOjRSeh00).

- [Using mouse position](http://www.youtube.com/watch?v=K_oJk6yn-Ws).

- [Forces depend on the distance](http://www.youtube.com/watch?v=3puot3qlYOg).

for the final render I only added alpha blending and color base on particle speed.

## package
