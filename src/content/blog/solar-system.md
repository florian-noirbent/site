---
title: "Solar System in OpenGL"
description: "My first computer graphics project of the year: a small solar system in C++ and OpenGL, with a custom .obj and .bmp importer, vertex arrays, lighting and textures."
date: 2013-10-04
type: devlog
tags:
  - "C++"
  - "OpenGL"
  - "Beijing Jiaotong University"
  - "Student"
---

Here is my first school project of this year. Nothing spectacular yet, but it was a good way to get back into OpenGL and C++. I hadn't used OpenGL directly since my Bomberman two years ago, and I hadn't written C++ in a while, since I mostly worked with XNA and Unity last year.

<iframe src="https://www.youtube-nocookie.com/embed/DhoJWJnjkhQ" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Also on Youku](http://v.youku.com/v_show/id_XNjE2OTg0OTA4.html)

The assignment was simply to draw an object in *immediate mode* (sending vertices one by one between `glBegin` and `glEnd`), move it with `glTranslate()`, and use the matrix stack (`glPushMatrix` and `glPopMatrix`), which lets a child object inherit its parent's transform, the natural way to make one body orbit another that is itself moving.

I went further and added:

- a `.obj` model importer
- a `.bmp` image importer
- vertex arrays, which send whole meshes at once instead of one vertex per call
- fixed-pipeline lighting
- textures

The importer only handles triangles for now. It also doesn't duplicate vertices along UV seams when the modeling software hasn't done it: a vertex on a seam needs two different texture coordinates, one for each side, so without duplication the texture is stretched along the joint. This is mostly visible on the background. I don't know yet whether I'll need to finish the importer or whether we'll be allowed to use a library in later projects.
