---
title: "disappear objects shader"
description: "I developed a small shader to disappear objects in unity. It started from a discussion about this video: https://www.youtube.com/watch?v=aDht3p5Gr3M, where I found sad that object…"
date: 2013-08-02
type: technical
tags:
  - "Unity"
  - "Cg"
  - "Shaders"
  - "Student"
cardImage: /images/blog/disappear-objects-shader/colorDepoppng.png
---

I developed a small shader to disappear objects in unity. It started from a discussion about this video: [https://www.youtube.com/watch?v=aDht3p5Gr3M](https://www.youtube.com/watch?v=aDht3p5Gr3M), where I found sad that object disappearance don't use the impact point of the projectiles, so I reproduced this behavior and added a spread starting from an impact point:

<iframe src="https://www.youtube-nocookie.com/embed/d3lSOr5_Nnw" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here are the sources, I hope someone will find this useful:

Shader: [http://pastebin.com/mkqePw1F](http://pastebin.com/mkqePw1F)

Code de test: [http://pastebin.com/k5GGVcLX](http://pastebin.com/k5GGVcLX)

It's a surface shader specific to Unity, so the code can not be used directly outside this engine, but the same principle can easily be reproduced elsewhere. To get the same separation line than in the first video, one just need to replace the gradient in the last "else if" by a color. ![colorDepop](/images/blog/disappear-objects-shader/colorDepoppng.png)
