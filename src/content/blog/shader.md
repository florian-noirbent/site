---
title: "An Introduction to Shaders"
description: "A primer on shaders: vertex and fragment programs, post-processing, Phong lighting, bloom and SSAO, and the input/output semantics most tutorials gloss over."
date: 2013-06-08
type: technical
tags:
  - "Cg"
  - "Shaders"
  - "Student"
---

This year I had to learn shader programming during my part-time internship, because nobody at the company knew how to do it. In this article I'll first introduce what shaders are, then present the shaders I wrote. Above all, I want to write what I wish I had found when I started: a clear explanation of input and output parameters, which most tutorials cover only vaguely.

The language doesn't matter much. Shading languages are all fairly similar, and converting from one to another is almost always a word-for-word translation, at least between Cg and GLSL. I haven't looked at HLSL yet, but Cg was designed alongside it and the two share nearly the same syntax.

## What is a shader?

[Wikipedia covers it in depth](http://en.wikipedia.org/wiki/Shader) (there is also a [French version](http://fr.wikipedia.org/wiki/Shader)), but in short, a shader is a program that runs on the GPU, mostly to produce what ends up on screen. The programmer selects which shaders to use when setting up a draw call, which gives full control over how objects are rendered.

The **vertex shader** runs once for each vertex in the draw call. At a minimum, it transforms each vertex from object space (coordinates relative to the object's own origin) into clip space. The GPU then performs the perspective divide and viewport transform to get the 2D position where the vertex lands on screen.

Between the two programmable stages, the rasterizer turns the transformed triangles into fragments: one candidate pixel for every screen pixel a triangle covers.

The **fragment shader** (called a pixel shader in Direct3D) then runs once per fragment and computes its color. Note that it runs for every covered pixel, not only for the visible ones: a fragment can still be discarded afterwards by the depth test if another surface is in front of it.

I won't cover the other shader stages that can be added to the pipeline here. Information about them is scarce, so I'd like to dedicate a future article to them.

## Post-processing

I need to explain this before going further, because several of my shaders depend on it.

[Post-processing](http://rbwhitaker.wikidot.com/post-processing-effects) means applying a shader to the final image of the scene rather than to each individual object. Instead of being displayed directly, the scene is rendered into a texture ("render to texture"). To add an effect, you then draw a quad (a rectangular mesh) that covers the whole viewport, textured with that image, while the fragment shader applies the effect: blur, color tinting, [and much more](http://en.wikipedia.org/wiki/Deferred_shading).

## My shaders

Each of these shaders could fill a series of articles on its own, but since they are well documented on other blogs, I'll only present them briefly.

### Per-pixel Phong shading with normal and specular maps

[Phong shading](http://en.wikipedia.org/wiki/Phong_shading) is the standard lighting technique in video games. Each object computes its lighting independently of the other objects in the scene, as the sum of three terms:

- **Ambient**: a uniform color applied to the whole scene.
- **Diffuse**: the object's color multiplied by the dot product of the surface normal and the direction to the light. Surfaces facing the light are bright, surfaces at a grazing angle are dark.
- **Specular**: a fake reflection of the light source that also depends on the camera position, which produces the shiny highlights.

"Per-pixel" means these computations run in the fragment program, for every pixel. The cheaper alternative evaluates lighting in the vertex program and interpolates the result across each triangle (Gouraud shading). Per-pixel lighting makes the biggest difference on low-poly objects, where interpolated lighting looks blotchy and highlights get lost between vertices, and wherever quality matters more than speed.

A **specular map** is a grayscale texture that defines how reflective each part of the mesh is, instead of using a single value for the whole object. On an old sheet of metal, for example, it keeps the rusty areas matte while the clean metal stays shiny.

The **normal map** gave me the most trouble. It perturbs the object's normals according to a texture, so the lighting reacts as if the surface had extra relief. This adds *trompe-l'œil* detail without increasing the polygon count.

It's a fairly heavy shader, but the result looks very realistic. It is used for real-time augmented reality, integrating 3D objects into filmed footage.

### Glow / bloom

Bloom is a post-process effect that makes objects look as if they emit light, by spreading their bright areas onto neighboring pixels. An extra render pass draws the scene as a mask: pixels that should glow are drawn in white, everything else in black. The post-process then blurs this mask and adds it on top of the normal image.

The blur is done in two passes, first horizontally and then vertically. A Gaussian blur is separable, so two one-dimensional passes give the same result as a full two-dimensional blur at a fraction of the cost: with a kernel of width *n*, each pixel reads 2*n* texels instead of *n*².

The main limitation of my implementation is that the amount of glow doesn't depend on the distance to the camera. That doesn't matter for its intended use, but adding a falloff with distance would require the [depth map](http://en.wikipedia.org/wiki/Depth_map).

### SSAO (screen-space ambient occlusion)

[Ambient occlusion](http://en.wikipedia.org/wiki/Ambient_occlusion) darkens creases, corners and contact areas that ambient light has trouble reaching. The usual approach precomputes it very slowly, so it only works on static objects. [SSAO](http://en.wikipedia.org/wiki/Screen_space_ambient_occlusion) is a real-time approximation that also works on dynamic objects.

It is again a post-process. For each pixel, the shader picks random sample points around it, oriented along its normal, and compares their depth with the depth buffer. Samples that end up behind the stored surface are occluded; the more occluded samples, the darker the pixel. A Gaussian blur is then applied to remove the noise introduced by the random sampling.

Because it works only on what's in the depth buffer, the result depends on the camera position and ignores anything outside the field of view, which produces very visible artifacts in some cases. Here is a nice video showing the result: [http://www.youtube.com/watch?v=R\_L-\_oGTbqw](http://www.youtube.com/watch?v=R_L-_oGTbqw).

## Input and output parameters

It may seem odd to focus on this detail, but it's what gave me the most trouble at first. Everything else follows the usual imperative style and only needs high-school math: trigonometry, matrix algebra and vector operations.

Here is a vertex shader from [NVIDIA's Cg Tutorial](http://http.developer.nvidia.com/CgTutorial/cg_tutorial_chapter01.html), a book I highly recommend:

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

### Semantics

Shaders exchange data through **semantics** such as `POSITION`, `COLOR`, `NORMAL` and `TEXCOORD0`, `TEXCOORD1`, and so on. A semantic is a label that tells the GPU which hardware slot a parameter is bound to.

- The **vertex program's inputs** come from the per-vertex data stored in the mesh by the artist: position, normal, color, texture coordinates.
- The **vertex program's outputs** are interpolated across each triangle by the rasterizer and become the **fragment program's inputs**.

A vertex program must at least output `POSITION`, the transformed vertex position in clip space. It can also output any other semantic the fragment program needs; in the example above, the vertex program passes a color down to the fragment program.

A fragment program must at least output a color. It can also output the `DEPTH` semantic to override the fragment's depth. To understand what this depth value is, read about the [Z-buffer](http://en.wikipedia.org/wiki/Z-buffering). I used it to merge video from a depth camera (color plus depth) into a 3D scene, which is not something you need every day.

Be careful: this depth is not linear, and it depends on the camera's near and far clip planes, so don't expect a distance in world units. With a standard perspective projection, a point at view distance *z* is stored as *d* = *f* / (*f* − *n*) × (1 − *n* / *z*), where *n* and *f* are the near and far planes: 0 at the near plane, 1 at the far plane, with most of the precision concentrated close to the camera. Documentation on this was scarce, and we ended up finding the right values by bisection.

### Uniforms

**Uniform parameters** have no semantic. The application sets them before the draw call, binding each one by its name, and their value stays the same for every vertex and fragment of that draw. For example, a shader that changes over time receives the current time this way (or more often its cosine, for cyclic effects). Light information is passed the same way.

### Two syntaxes

Cg offers two syntaxes for inputs and outputs, and they can be mixed, which confused me for a long time. You can either declare a structure containing your parameters (for inputs as well as outputs), or declare them directly in the function signature using the `in`, `out` and `inout` keywords:

```hlsl
C2E1v_Output C2E1v_green(
inout float4 position : POSITION
out float4 color : COLOR)
{
position = float4(position.xy, 0, 1);
color = float4(0, 1, 0, 1); // RGBA green
}
```

This is the first example translated to the second syntax, and it behaves exactly the same. (Since the outputs now go through `out` parameters, the function would normally be declared `void`, and the parameters need a comma between them.) This syntax is more concise, but it is further removed from C.

## Going further

I think this covers the information that is hardest to find online when starting shader programming. Some topics remain tough, such as geometry shaders in Cg, for which I found nothing beyond NVIDIA's long and dense reference documentation. For everything else, the many other blogs out there answered my questions.
