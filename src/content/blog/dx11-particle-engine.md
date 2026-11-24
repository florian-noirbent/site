---
title: "A DirectX 11 Particle Engine in Unity"
description: "A GPU particle engine built in Unity with DirectX 11 compute shaders, after comparing CUDA, OpenCL and DirectCompute for my voxel terrain generator."
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

These past few days I built a small DirectX 11 particle engine in Unity, mainly to learn how to use compute shaders. What I learned will let me move the terrain generation of my voxel engine to the GPU. Before getting to the engine itself, here is a quick look at the GPGPU (general-purpose computing on the GPU) options I tried.

## CUDA

There isn't much to say: CUDA is easy and straightforward to use. I set it aside because I didn't want my terrain generator to be "NVIDIA only". Outside of research and very specific cases, I find it hard to see who would use it: a consumer application can't afford to ignore half of the computers out there.

## OpenCL

It took me several days just to get a test program running. The API is heavy. In CUDA you call a kernel like any C function; in OpenCL you have to select the platform, then the device, compile the kernel source, set each kernel argument with a separate function call, and only then launch it, all with old-school error-code handling.

Most of my problems, though, came from NVIDIA, which provides the driver and seems to be dropping OpenCL support. They removed the helper functions from their SDK, so I had to dig them out of an older version, and most of the documentation is gone from their website, with only the samples left.

## DirectCompute

In the end I chose compute shaders, because of their integration with Unity. Before settling on them, I had started a .NET wrapper for OpenCL, but because of Unity's API it wouldn't have let me share data directly with vertex and fragment shaders. Every frame's data would have had to go through the CPU, whereas compute buffers stay on the GPU and can be read straight from the rendering shaders.

The main drawback, as the title says, is that it only works with DirectX 11. Direct3D 11 was released in 2009, so it's already almost four years old and will only become more widespread. For now, though, it slows me down considerably, since my desktop computer is the only machine I have that can run it.

To learn, I mainly used [Microsoft's DirectCompute lecture series](http://channel9.msdn.com/tags/DirectCompute-Lecture-Series/). My C++ test worked fine, but when I turned to Unity's API, I found [completely empty documentation for many functions](http://docs.unity3d.com/Documentation/ScriptReference/ComputeBuffer.SetData.html). With the help of the forums and a lot of experimenting, I eventually got working code. That's why I released my particle engine as a commented package, hoping it would save others the time it cost me. The comments assumed no prior knowledge of regular shader programming either.

<iframe src="https://www.youtube-nocookie.com/embed/4eS6lyAJ4EE" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here are the intermediate steps:

- [First moving particle](http://www.youtube.com/watch?v=k9pOjRSeh00)
- [Using the mouse position](http://www.youtube.com/watch?v=K_oJk6yn-Ws)
- [Forces that depend on distance](http://www.youtube.com/watch?v=3puot3qlYOg)

For the final render, I only added alpha blending and a color based on each particle's speed.

## Package

*The package was hosted on my old website and is no longer available.*
