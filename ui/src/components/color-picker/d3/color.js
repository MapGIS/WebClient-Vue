import * as d3 from "d3-scale-chromatic";

export const Categorical = {
  Category10: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/category10.png",
    scheme: d3.schemeCategory10,
    key: "schemeCategory10",
    title: "默认10色"
  },
  Accent: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Accent.png",
    scheme: d3.schemeAccent,
    key: "schemeAccent ",
    title: "强调色"
  },
  Dark2: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Dark2.png",
    scheme: d3.schemeDark2,
    key: "schemeDark2 ",
    title: "黑暗色"
  },
  Paired: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Paired.png",
    scheme: d3.schemePaired,
    key: "schemePaired",
    title: "匹配色"
  },
  Pastel1: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Pastel1.png",
    scheme: d3.schemePastel1,
    key: "schemePastel1 ",
    title: "蜡笔色1"
  },
  Pastel2: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Pastel2.png",
    scheme: d3.schemePastel2,
    key: "schemePastel2 ",
    title: "蜡笔色2"
  },
  Set1: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set1.png",
    scheme: d3.schemeSet1,
    key: "schemeSet1",
    title: "固定色1"
  },
  Set2: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set2.png",
    scheme: d3.schemeSet2,
    key: "schemeSet2",
    title: "固定色2"
  },
  Set3: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set3.png",
    scheme: d3.schemeSet3,
    key: "schemeSet3",
    title: "固定色3"
  }
};

export const Diverging = {
  BrBG: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BrBG.png",
    scheme: d3.schemeBrBG[11],
    interpolate: d3.interpolateBrBG,
    key: "schemeBrBG",
    title: "棕蓝绿色"
  },
  PRGn: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PRGn.png",
    scheme: d3.schemePRGn[11],
    interpolate: d3.interpolatePRGn,
    key: "schemePRGn",
    title: "紫灰绿色"
  },
  PiYG: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PiYG.png",
    scheme: d3.schemePiYG[11],
    interpolate: d3.interpolatePiYG,
    key: "schemePiYG",
    title: "紫黄绿色"
  },
  PuOr: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuOr.png",
    scheme: d3.schemePuOr[11],
    interpolate: d3.interpolatePuOr,
    key: "schemePuOr",
    title: "紫橘色"
  },
  RdBu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdBu.png",
    scheme: d3.schemeRdBu[11],
    interpolate: d3.interpolateRdBu,
    key: "schemeRdBu",
    title: "红蓝色"
  },
  RdGy: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdGy.png",
    scheme: d3.schemeRdGy[11],
    interpolate: d3.interpolateRdGy,
    key: "schemeRdGy",
    title: "红灰色"
  },
  YlBu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdYlBu.png",
    scheme: d3.schemeRdYlBu[11],
    interpolate: d3.interpolateRdYlBu,
    key: "schemeRdYlBu",
    title: "红黄蓝色"
  },
  RdYlGn: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdYlGn.png",
    scheme: d3.schemeRdYlGn[11],
    interpolate: d3.interpolateRdYlGn,
    key: "schemeRdYlGn",
    title: "红黄绿色"
  },
  Spectral: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Spectral.png",
    scheme: d3.schemeSpectral[11],
    interpolate: d3.interpolateSpectral,
    key: "schemeSpectral",
    title: "光谱色"
  }
};

export const SequentialSingleHue = {
  Blues: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Blues.png",
    scheme: d3.schemeBlues[9],
    interpolate: d3.interpolateBlues,
    key: "schemeBlues",
    title: "蓝色"
  },
  Greens: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Greens.png",
    scheme: d3.schemeGreens[9],
    interpolate: d3.interpolateGreens,
    key: "schemeGreens",
    title: "绿色"
  },
  Greys: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Greys.png",
    scheme: d3.schemeGreys[9],
    interpolate: d3.interpolateGreys,
    key: "schemeGreys",
    title: "灰色"
  },
  Oranges: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Oranges.png",
    scheme: d3.schemeOranges[9],
    interpolate: d3.interpolateOranges,
    key: "schemeOranges",
    title: "橘色"
  },
  Purples: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Purples.png",
    scheme: d3.schemePurples[9],
    interpolate: d3.interpolatePurples,
    key: "schemePurples",
    title: "紫色"
  },
  Reds: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Reds.png",
    scheme: d3.schemeReds[9],
    interpolate: d3.interpolateReds,
    key: "schemeReds",
    title: "红色"
  }
};

export const SequentialMultiHue = {
  Viridis: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/viridis.png",
    interpolate: d3.interpolateViridis,
    key: "interpolateViridis",
    title: "翠绿色"
  },
  Inferno: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/inferno.png",
    interpolate: d3.interpolateInferno,
    key: "interpolateInferno",
    title: "阴冷色"
  },
  Magma: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/magma.png",
    interpolate: d3.interpolateMagma,
    key: "interpolateMagma",
    title: "岩浆色"
  },
  Plasma: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/plasma.png",
    interpolate: d3.interpolatePlasma,
    key: "interpolatePlasma",
    title: "深绿玉色"
  },
  Warm: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/warm.png",
    interpolate: d3.interpolateWarm,
    key: "interpolateWarm",
    title: "暖色"
  },
  Cool: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/cool.png",
    interpolate: d3.interpolateCool,
    key: "interpolateCool",
    title: "冷色"
  },
  Cubehelix: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/cubehelix.png",
    interpolate: d3.interpolateCubehelixDefault,
    key: "interpolateCubehelixDefault",
    title: "螺旋色"
  },
  BuGn: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BuGn.png",
    scheme: d3.schemeBuGn[9],
    interpolate: d3.interpolateBuGn,
    key: "schemeBuGn",
    title: "蓝绿色"
  },
  BuPu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BuPu.png",
    scheme: d3.schemeBuPu[9],
    interpolate: d3.interpolateBuPu,
    key: "interpolateBuPu",
    title: "蓝紫色"
  },
  GnBu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/GnBu.png",
    scheme: d3.schemeGnBu[9],
    interpolate: d3.interpolateGnBu,
    key: "interpolateGnBu",
    title: "绿蓝色"
  },
  OrRd: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/OrRd.png",
    scheme: d3.schemeOrRd[9],
    interpolate: d3.interpolateOrRd,
    key: "interpolateOrRd",
    title: "橘红色"
  },
  PuBuGn: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuBuGn.png",
    scheme: d3.schemePuBuGn[9],
    interpolate: d3.interpolatePuBuGn,
    key: "interpolatePuBuGn",
    title: "紫蓝绿色"
  },
  PuBu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuBu.png",
    scheme: d3.schemePuBu[9],
    interpolate: d3.interpolatePuBu,
    key: "interpolatePuBu",
    title: "紫蓝色"
  },
  PuRd: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuRd.png",
    scheme: d3.schemePuRd[9],
    interpolate: d3.interpolatePuRd,
    key: "interpolatePuRd",
    title: "紫红色"
  },
  RdPu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdPu.png",
    scheme: d3.schemeRdPu[9],
    interpolate: d3.interpolateRdPu,
    key: "interpolateRdPu",
    title: "红紫色"
  },
  YlGnBu: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlGnBu.png",
    scheme: d3.schemeYlGnBu[9],
    interpolate: d3.interpolateYlGnBu,
    key: "interpolateYlGnBu",
    title: "黄绿蓝色"
  },
  YlGn: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlGn.png",
    scheme: d3.schemeYlGn[9],
    interpolate: d3.interpolateYlGn,
    key: "interpolateYlGn",
    title: "黄绿色"
  },
  YlOrBr: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlOrBr.png",
    scheme: d3.schemeYlOrBr[9],
    interpolate: d3.interpolateYlOrBr,
    key: "interpolateYlOrBr",
    title: "黄橘色"
  },
  YlOrRd: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlOrRd.png",
    scheme: d3.schemeYlOrRd[9],
    interpolate: d3.interpolateYlOrRd,
    key: "interpolateYlOrRd",
    title: "黄橘红色"
  }
};

export const Cyclical = {
  Rainbow: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/rainbow.png",
    scheme: d3.interpolateRainbow,
    key: "interpolateRainbow",
    title: "马卡龙"
  },
  Sinebow: {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/sinebow.png",
    scheme: d3.interpolateSinebow,
    key: "interpolateSinebow",
    title: "彩虹"
  }
};

export const CategoricalList = [
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/category10.png",
    icon: "static/color/images/Categorical/category10.png",
    scheme: d3.schemeCategory10,
    key: "schemeCategory10",
    title: "默认10色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Accent.png",
    icon: "static/color/images/Categorical/Accent.png",
    scheme: d3.schemeAccent,
    key: "schemeAccent ",
    title: "强调色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Dark2.png",
    icon: "static/color/images/Categorical/Dark2.png",
    scheme: d3.schemeDark2,
    key: "schemeDark2 ",
    title: "黑暗色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Paired.png",
    icon: "static/color/images/Categorical/Paired.png",
    scheme: d3.schemePaired,
    key: "schemePaired",
    title: "匹配色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Pastel1.png",
    icon: "static/color/images/Categorical/Pastel1.png",
    scheme: d3.schemePastel1,
    key: "schemePastel1 ",
    title: "蜡笔色1"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Pastel2.png",
    icon: "static/color/images/Categorical/Pastel2.png",
    scheme: d3.schemePastel2,
    key: "schemePastel2 ",
    title: "蜡笔色2"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set1.png",
    icon: "static/color/images/Categorical/Set1.png",
    scheme: d3.schemeSet1,
    key: "schemeSet1",
    title: "固定色1"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set2.png",
    icon: "static/color/images/Categorical/Set2.png",
    scheme: d3.schemeSet2,
    key: "schemeSet2",
    title: "固定色2"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Set3.png",
    icon: "static/color/images/Categorical/Set3.png",
    scheme: d3.schemeSet3,
    key: "schemeSet3",
    title: "固定色3"
  }
];

export const DivergingList = [
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BrBG.png",
    icon: "static/color/images/Diverging/BrBG.png",
    scheme: d3.schemeBrBG[11],
    interpolate: d3.interpolateBrBG,
    key: "schemeBrBG",
    title: "棕蓝绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PRGn.png",
    icon: "static/color/images/Diverging/PRGn.png",
    scheme: d3.schemePRGn[11],
    interpolate: d3.interpolatePRGn,
    key: "schemePRGn",
    title: "紫灰绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PiYG.png",
    icon: "static/color/images/Diverging/PiYG.png",
    scheme: d3.schemePiYG[11],
    interpolate: d3.interpolatePiYG,
    key: "schemePiYG",
    title: "紫黄绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuOr.png",
    icon: "static/color/images/Diverging/PuOr.png",
    scheme: d3.schemePuOr[11],
    interpolate: d3.interpolatePuOr,
    key: "schemePuOr",
    title: "紫橘色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdBu.png",
    icon: "static/color/images/Diverging/RdBu.png",
    scheme: d3.schemeRdBu[11],
    interpolate: d3.interpolateRdBu,
    key: "schemeRdBu",
    title: "红蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdGy.png",
    icon: "static/color/images/Diverging/RdGy.png",
    scheme: d3.schemeRdGy[11],
    interpolate: d3.interpolateRdGy,
    key: "schemeRdGy",
    title: "红灰色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdYlBu.png",
    icon: "static/color/images/Diverging/RdYlBu.png",
    scheme: d3.schemeRdYlBu[11],
    interpolate: d3.interpolateRdYlBu,
    key: "schemeRdYlBu",
    title: "红黄蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdYlGn.png",
    icon: "static/color/images/Diverging/RdYlGn.png",
    scheme: d3.schemeRdYlGn[11],
    interpolate: d3.interpolateRdYlGn,
    key: "schemeRdYlGn",
    title: "红黄绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Spectral.png",
    icon: "static/color/images/Diverging/Spectral.png",
    scheme: d3.schemeSpectral[11],
    interpolate: d3.interpolateSpectral,
    key: "schemeSpectral",
    title: "光谱色"
  }
];

export const SequentialSingleHueList = [
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Blues.png",
    icon: "static/color/images/SequentialSingleHue/Blues.png",
    scheme: d3.schemeBlues[9],
    interpolate: d3.interpolateBlues,
    key: "schemeBlues",
    title: "蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Greens.png",
    icon: "static/color/images/SequentialSingleHue/Greens.png",
    scheme: d3.schemeGreens[9],
    interpolate: d3.interpolateGreens,
    key: "schemeGreens",
    title: "绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Greys.png",
    icon: "static/color/images/SequentialSingleHue/Greys.png",
    scheme: d3.schemeGreys[9],
    interpolate: d3.interpolateGreys,
    key: "schemeGreys",
    title: "灰色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Oranges.png",
    icon: "static/color/images/SequentialSingleHue/Oranges.png",
    scheme: d3.schemeOranges[9],
    interpolate: d3.interpolateOranges,
    key: "schemeOranges",
    title: "橘色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Purples.png",
    icon: "static/color/images/SequentialSingleHue/Purples.png",
    scheme: d3.schemePurples[9],
    interpolate: d3.interpolatePurples,
    key: "schemePurples",
    title: "紫色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/Reds.png",
    icon: "static/color/images/SequentialSingleHue/Reds.png",
    scheme: d3.schemeReds[9],
    interpolate: d3.interpolateReds,
    key: "schemeReds",
    title: "红色"
  }
];

export const SequentialMultiHueList = [
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/viridis.png",
    icon: "static/color/images/SequentialMultiHue/viridis.png",
    interpolate: d3.interpolateViridis,
    key: "interpolateViridis",
    title: "翠绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/inferno.png",
    icon: "static/color/images/SequentialMultiHue/inferno.png",
    interpolate: d3.interpolateInferno,
    key: "interpolateInferno",
    title: "阴冷色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/magma.png",
    icon: "static/color/images/SequentialMultiHue/magma.png",
    interpolate: d3.interpolateMagma,
    key: "interpolateMagma",
    title: "岩浆色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/plasma.png",
    icon: "static/color/images/SequentialMultiHue/plasma.png",
    interpolate: d3.interpolatePlasma,
    key: "interpolatePlasma",
    title: "深绿玉色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/warm.png",
    icon: "static/color/images/SequentialMultiHue/warm.png",
    interpolate: d3.interpolateWarm,
    key: "interpolateWarm",
    title: "暖色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/cool.png",
    icon: "static/color/images/SequentialMultiHue/cool.png",
    interpolate: d3.interpolateCool,
    key: "interpolateCool",
    title: "冷色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/cubehelix.png",
    icon: "static/color/images/SequentialMultiHue/cubehelix.png",
    interpolate: d3.interpolateCubehelixDefault,
    key: "interpolateCubehelixDefault",
    title: "螺旋色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BuGn.png",
    icon: "static/color/images/SequentialMultiHue/BuGn.png",
    scheme: d3.schemeBuGn[9],
    interpolate: d3.interpolateBuGn,
    key: "schemeBuGn",
    title: "蓝绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/BuPu.png",
    icon: "static/color/images/SequentialMultiHue/BuPu.png",
    scheme: d3.schemeBuPu[9],
    interpolate: d3.interpolateBuPu,
    key: "interpolateBuPu",
    title: "蓝紫色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/GnBu.png",
    icon: "static/color/images/SequentialMultiHue/GnBu.png",
    scheme: d3.schemeGnBu[9],
    interpolate: d3.interpolateGnBu,
    key: "interpolateGnBu",
    title: "绿蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/OrRd.png",
    icon: "static/color/images/SequentialMultiHue/OrRd.png",
    scheme: d3.schemeOrRd[9],
    interpolate: d3.interpolateOrRd,
    key: "interpolateOrRd",
    title: "橘红色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuBuGn.png",
    icon: "static/color/images/SequentialMultiHue/PuBuGn.png",
    scheme: d3.schemePuBuGn[9],
    interpolate: d3.interpolatePuBuGn,
    key: "interpolatePuBuGn",
    title: "紫蓝绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuBu.png",
    icon: "static/color/images/SequentialMultiHue/PuBu.png",
    scheme: d3.schemePuBu[9],
    interpolate: d3.interpolatePuBu,
    key: "interpolatePuBu",
    title: "紫蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/PuRd.png",
    icon: "static/color/images/SequentialMultiHue/PuRd.png",
    scheme: d3.schemePuRd[9],
    interpolate: d3.interpolatePuRd,
    key: "interpolatePuRd",
    title: "紫红色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/RdPu.png",
    icon: "static/color/images/SequentialMultiHue/RdPu.png",
    scheme: d3.schemeRdPu[9],
    interpolate: d3.interpolateRdPu,
    key: "interpolateRdPu",
    title: "红紫色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlGnBu.png",
    icon: "static/color/images/SequentialMultiHue/YlGnBu.png",
    scheme: d3.schemeYlGnBu[9],
    interpolate: d3.interpolateYlGnBu,
    key: "interpolateYlGnBu",
    title: "黄绿蓝色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlGn.png",
    icon: "static/color/images/SequentialMultiHue/YlGn.png",
    scheme: d3.schemeYlGn[9],
    interpolate: d3.interpolateYlGn,
    key: "interpolateYlGn",
    title: "黄绿色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlOrBr.png",
    icon: "static/color/images/SequentialMultiHue/YlOrBr.png",
    scheme: d3.schemeYlOrBr[9],
    interpolate: d3.interpolateYlOrBr,
    key: "interpolateYlOrBr",
    title: "黄橘色"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/YlOrRd.png",
    icon: "static/color/images/SequentialMultiHue/YlOrRd.png",
    scheme: d3.schemeYlOrRd[9],
    interpolate: d3.interpolateYlOrRd,
    key: "interpolateYlOrRd",
    title: "黄橘红色"
  }
];

export const CyclicalList = [
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/rainbow.png",
    icon: "static/color/images/Cyclical/rainbow.png",
    scheme: d3.interpolateRainbow,
    key: "interpolateRainbow",
    title: "马卡龙"
  },
  {
    url:
      "https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/sinebow.png",
    icon: "static/color/images/Cyclical/sinebow.png",
    scheme: d3.interpolateSinebow,
    key: "interpolateSinebow",
    title: "彩虹"
  }
];

export const Schemes = [
  { name: "类型配色", type: "Categorical", value: CategoricalList },
  {
    name: "单一渐变色",
    type: "SequentialSingleHue",
    value: SequentialSingleHueList
  },
  { name: "彩虹配色", type: "Cyclical", value: CyclicalList }
];

export const Interpolates = [
  { name: "对比色", type: "Diverging", value: DivergingList },
  {
    name: "单一渐变色",
    type: "SequentialSingleHue",
    value: SequentialSingleHueList
  },
  {
    name: "复杂渐变色",
    type: "SequentialMultiHue",
    value: SequentialMultiHueList
  }
];
