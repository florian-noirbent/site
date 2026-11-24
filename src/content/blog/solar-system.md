---
title: "Solar system"
description: "Here is a first school project, I made in this begening of this school year. Nothing awesome yet, but it helped to get back to openGL and C++, I didn't used directly openGL since…"
date: 2013-10-04
type: devlog
tags:
  - "C++"
  - "OpenGL"
  - "Beijing Jiaotong University"
  - "Student"
---

Here is a first school project, I made in this begening of this school year. Nothing awesome yet, but it helped to get back to openGL and C++, I didn't used directly openGL since my bomberman 2 years ago, and did not use C++ for a while because I mainly worked with XNA and Unity last year.

<iframe src="https://www.youtube-nocookie.com/embed/DhoJWJnjkhQ" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[also on youku](http://v.youku.com/v_show/id_XNjE2OTg0OTA4.html)

The subject was just to draw an object in *immediate mode,* and move it with glTranslate() and also use the matrix stack.

I added:

- a .obj model importer.

- a .bmp image importer.

- usage of vertex array.

- usage of the fixed pipeline lighting.

- usage of textures.

The importer only handle triangles yet and don't duplicate vertices on UV seams if the modeling application don't do it, so there is a probem on the joint, mainly visible on the background. I don't know yet if I'll need to complete it or if I'll be allowed to use a library in the future.

sources are here
