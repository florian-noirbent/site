---
title: "shader"
description: "I needed to learn shader programming in my internship part time this year, because no one knew in the company. I'll introduce it first, then I'll show what shaders I made, but…"
date: 2013-06-08
type: technical
tags:
  - "Cg"
  - "Shaders"
  - "Student"
---

I needed to learn shader programming in my internship part time this year, because no one knew in the company. I'll introduce it first, then I'll show what shaders I made, but mainly I'll write what I would have loved to find when I started to look for information: explanation on input and output parameters, since most tutos are extremely vague about it.

The language actually doesn't really matter, They are all fairly alike and conversion is almost always word to word, at least CG and GLSL, I haven't yet looked into HLSL.

## What's a shader ?

[Wikipedia'll tell you more than me](http://en.wikipedia.org/wiki/Shader), but in few words it's a program executed on the GPU, so mainly for display, they are chosen by the programmer when initializing a draw call and give the possibility to get exactly the render you want.

[T](http://fr.wikipedia.org/wiki/Shader)he **vertex shader** is executed for each vertices in the draw call and will at least convert each vertex coordinate from it's object coordinate (relative to it's center) in screen space coordinate (the 2D position where it will appear on the screen).

Then come the **fragment shader,** executed for each *'visible'* pixel on the screen and will calculate it's color.

I wont discus about the other shader type which can be added to the pipeline, but since the lack of information about it i'd love to talk about it in a upcoming article, nor on the work done by the GPU between shaders (like rasterizer).

## Postprocess

I didn't want to talk imediatly about it but it's necessary ton understand what I did.

The [postprocess](http://rbwhitaker.wikidot.com/post-processing-effects) is about applying a shader on the final render of a screen instead of each individual objects. When the scene get rendered it's saved into a texture instead of displayed on the screen ("render to texture"), then to add an effect simply generate a quad (a rectangular mesh) in front of the camera which fill the viewport ("the field of view"), then draw the texture of the scene on this quad while applying the desired effect (blur, change the color tint, [or much more](http://en.wikipedia.org/wiki/Deferred_shading)).

## My shaders

Each shader almost demand for it's own article series, but since everything is fully documented on other blogs, I'll just present them quickly

phong shading pixel-perfect with normal map and specular map:

Even trying to be quick, there is a lot to tell, the [phong shading](http://en.wikipedia.org/wiki/Phong_shading) is the usual method for lightning calculation in video games, each object compute it's own lightning independently of the other objects on the scene, it's the addition of an ambient (uniform color ont the scene), a diffuse (color of the object multiplied by the scalar product of the normal by the light source direction), and the specular (a fake reflection using the camera position in the operation).

Pixel perfect mean that the computations described above are done in the fragment program, so for each pixel, unlike the usual method that compute everything in the vertex program, it used for big-really low poly objects, or when quality is more important than speed.

The specular map is a black and white texture that tell the "intensity of reflection" of each part of the mesh unlike having a uniform property, It have been used for example on old sheets metal, to make the rusty part mat and the normal part shiny .

The normal map now..., I struggled the most on this, disrupt the normal of the object according to a texture, it allow to add detail in *trompe-l’œil* without increasing the polygon count.

It is a quite heavy shader, but with a really realistic look, it is used for augmented reality in real time (integrated 3D objects in a film).

Glow/Bloom:

The bloom is a post process shader that make an object look like it emit light, it work in spreading the shiny part on the adjacent pixels. an additional pass done on the scene define the pixels that will shine (each is drawn in black (normal) and white (illuminated) in this pass. then the post process blur these pixel along horizontal then vertial (no recursion on GPU), here is an illustration from the cinder forum:

The major inconvenient for my implementation is that the "glow quantity" don't depend on the distance to the camera, it don't mater for it's purpose but a work with the [deth map](http://en.wikipedia.org/wiki/Depth_map) would be needed if we wanted a falloff.

SSAO (Screen-space ambient occlusion):

The [SSAO](http://en.wikipedia.org/wiki/Screen_space_ambient_occlusion) fake an [ambient occlusion](http://en.wikipedia.org/wiki/Ambient_occlusion) for real time (the usual method is applied on static objects only and is very slowly precalculated), this method is approximate but allow to be used on dynamic objects. Again it's a post process shader that compare the deth of each pixel to another random pixel near it's normal, if it's behind it's black else it's white. then a Gaussian blur is applied to the result to remove the noise from the random part of this technique. So the render depend of the camera position and only take into acocunt objects in the field of view, (which produce very visible artifact in some case). I found a nice video illustrating the result: [http://www.youtube.com/watch?v=R\_L-\_oGTbqw](http://www.youtube.com/watch?v=R_L-_oGTbqw).

## Input and Output parameters

It may seem surprising to see me focus on this detail, but it's the one that caused me the most troubles at first, since everything else follow an usual imperative paradigm and just mathematics (trigonometry, matrix algebra and vector operation) from high school level.

Here is a vertex shader from the [nvidia book](http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter01.html) that I highly recommend.

```hlsl
struct C2E1v_Output {
float4 position : POSITION;
float4 color : COLOR;
};
C2E1v_Output C2E1v_green(float2 position : POSITION)
{
C2E1v_Output OUT;
OUT.position = float4(position, 0, 1);
OUT.color = float4(0, 1, 0, 1); // RGBA green
return OUT;
}
```

The shaders work with semantic (POSITION COLOR, NORMAL TEXCOORD0 to 8) for example, that the vertex program can receive, these input information come from the data saved in the mesh by the graphist. then the input parameters of the fragment program come from the interpolated output parameters of the vertex program.

To compile, the vertex program need at least to return the POSITION semantic which define the transformed vertex position into the screen space and it can input any other semantic that could be usefull for the fragment program (in the example above, the color is sent from the vertex program).

The fragment program to compile need a least return a color, it may also change then output the DEPTH semantic to modify the depth of the fragment, to understand this "2D depth", i'll let you read about "[Z buffer](http://en.wikipedia.org/wiki/Z-buffering)". I used it to merge a video from a 3D camera (color and depth) in a 3D scene, it's not used everyday^^. This depth is not linear and depend of the near and far clip of the camera, I don't know more, documentation is rare and we got our result by dichotomy, just don't expect it to be a distance in the standard unit.

Then there is the uniform parameters which don't have semantics they are passed to the shader directly in the draw call and are bound by there names, for example the time will be sent like this for a shader changing with the time (or most usually the cosinus of the time for cyclic effects); but we also send lights information this way.

Input and output parameters have 2 different syntax in Cg, which can be mixed (it confused me a long time), you can ether declare a structure an put your parameters inside (input as output), or you can also declare your parameters in the function with in, and out keywords:

```hlsl
C2E1v_Output C2E1v_green(
inout float4 position : POSITION
out float4 color : COLOR)
{
position = float4(position.xy, 0, 1);
color = float4(0, 1, 0, 1); // RGBA green
}
```

Here I translated the first example, it as exactly the same behavior, it's an easier syntax but also farther than C.

I think I covered the most hard to find information on internet to start shader programming easily, there is more tough subjects like geometry shaders in Cg that I haven't found information apart from the 100 unintelligible pages from the Nvidia's documentation, for the rest the hundreds of other blogs answered my questions.
