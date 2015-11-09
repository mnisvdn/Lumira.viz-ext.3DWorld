# Lumira.viz-ext.3DWorld

Hi everyone. This repository is a viz extension for SAP Lumira.
It displays a 3D world where you can map your longitude/latitude data, as well as put two indicators on them (size/color).

This explanation will be updated as I update the code.

![viz](http://s7.postimg.org/g844to44r/Screen1.png)

For the moment, let's viz :) !

**Current limitations**
- There is no legend for the extension, I've planned to make one tho (or maybe some kind of *infowindow*)
- Even if technically the globe supports an infinity of points, the performance starts to decrease above 250/300 points. The performance decreases even faster as you put several times the extension in a Lumira Story.
- Adding more than one time this extension per page in a Lumira story lead to an unexpected bahviour : only the last globe added can be rotated. I've found the reason as well as a fix, but I'm not happy with it for the moment so I'll let it as a limitation
