export class Sprite {
  static GlobalJsonUrl;
  static GlobalPngUrl;
  static GlobalJsonData;
  static GlobalPngData;

  static base64ToImage(base64) {
    const img = document.createElement("img").setAttribute("src", base64);
    return img;
  }

  static dataURLtoFile(dataurl, filename = "file") {
    // tslint:disable-next-line: prefer-const
    let arr = dataurl.split(",");
    // tslint:disable-next-line: prefer-const
    let mime = arr[0].match(/:(.*?);/)[1];
    // tslint:disable-next-line: prefer-const
    let suffix = mime.split("/")[1];
    // tslint:disable-next-line: prefer-const
    let bstr = atob(arr[1]);
    let n = bstr.length;
    // tslint:disable-next-line: prefer-const
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    });
  }

  // static async GlobalCombineSprite() {
  //     const jsonUrl = await axios.get(this.json);
  //     const pngUrl = await axios.get(this.png, { responseType: 'arraybuffer' });
  //     const datas = [pngUrl, jsonUrl];
  //     return datas;
  // }

  // static GlobalParseSprite() {
  //     const datas = GlobalCombineSprite();
  //     const png = datas[0];
  //     const json = datas[1];
  //     if (!png || !json) {
  //         return {};
  //     }
  //     const base64 = 'data:image/png;base64,' +
  //         btoa(new Uint8Array(png.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  //     const spriteImage = new Image();
  //     spriteImage.src = base64;
  //     const pngData = spriteImage;
  //     const jsonData = json.data;
  //     this.pngData = pngData;
  //     this.jsonData = jsonData;
  //     return { pngData, jsonData };
  // }

  /**
   * @param icon 图片名称
   * @param spriteImage 样式符号图片png
   * @param spriteData 样式说明文件json
   * @param canvas 画布
   */
  static getSpriteIcon(icon, spriteImage, spriteData, canvas) {
    canvas = canvas ? canvas : document.createElement("canvas");
    if (canvas && spriteImage && spriteData && spriteData[icon]) {
      let pattern;
      const spriteImageData = spriteData[icon];
      canvas.width = spriteImageData.width;
      canvas.height = spriteImageData.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        spriteImage,
        spriteImageData.x,
        spriteImageData.y,
        spriteImageData.width,
        spriteImageData.height,
        0,
        0,
        spriteImageData.width,
        spriteImageData.height
      );
      pattern = ctx.createPattern(canvas, "repeat");
      return pattern;
    }
    return undefined;
  }

  /**
   * @param icon 图片名称
   * @param spriteImage 样式符号图片png
   * @param spriteData 样式说明文件json
   * @param canvas 画布
   */
  static getSpriteReactDom(icon, spriteImage, spriteData, refs) {
    if (refs && spriteImage && spriteData && spriteData[icon]) {
      let pattern;
      const spriteImageData = spriteData[icon];
      const canvas = refs[`sprite-${icon}`].canvas;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        spriteImage,
        spriteImageData.x,
        spriteImageData.y,
        spriteImageData.width,
        spriteImageData.height,
        0,
        0,
        spriteImageData.width,
        spriteImageData.height
      );
      pattern = ctx.createPattern(canvas, "repeat");
      return pattern;
    }
    return undefined;
  }

  /**
   * @param icon 图片名称
   * @param spriteImage 样式符号图片png
   * @param spriteData 样式说明文件json
   * @param canvas 画布
   */
  static getSpriteImageData(icon, spriteImage, spriteData, canvas) {
    canvas = canvas ? canvas : document.createElement("canvas");
    if (spriteImage && spriteData && spriteData[icon]) {
      let pattern;
      const spriteImageData = spriteData[icon];
      const { width = 16, height = 16, x = 0, y = 0 } = spriteImageData;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(spriteImage, x, y, width, height, 0, 0, width, height);
      pattern = ctx.createPattern(canvas, "repeat");
      return ctx.getImageData(0, 0, width, height);
    }
    return undefined;
  }

  /**
   * @description 符号库名称
   * @type String
   **/
  title;

  /**
   * @description 符号库文件夹名称
   * @type String
   **/
  path;

  /**
   * @description 符号库json文件地址
   * @type String
   **/
  json;

  /**
   * @description 符号库png文件地址
   * @type String
   **/
  png;

  /**
   * @description 符号库json文件内容
   **/
  jsonData;

  /**
   * @description 符号库png文件内容
   * @type String | HTMLImageElement
   **/
  pngData;

  constructor(options) {
    const { title, path, json, png } = options;
    this.title = title;
    this.path = path;
    this.json = json;
    this.png = png;
    this.jsonData = undefined;
    this.pngData = undefined;
  }

  async initSprite() {
    const json = await this.parseJson();
    const png = await this.parsePng();
    const result = this.parseSprite([png, json]);
    return result;
  }

  async getSpriteItem(iconid) {
    let base64;
    if (!this.pngData || !this.jsonData) {
      if (this.json && this.png) {
        const datas = await this.initSprite();
        const result = this.parseSprite(datas);
        const { pngData, jsonData } = result;
        base64 = Sprite.getSpriteIcon(iconid, pngData, jsonData);
      }
    } else {
      base64 = Sprite.getSpriteIcon(iconid, this.pngData, this.jsonData);
    }
    return base64;
  }

  /**
   * @description 针对高分辨率屏幕导致的xxx@2 xxx@3的情况进行对应的统一path处理
   */
  fixPath() {
    if (this.title) {
      const names = this.title.split("@");
      if (names && names.length >= 0) {
        this.path = names[0];
      }
    }
  }

  async parsePng() {
    const png = await fetch(this.png);
    const arraybuffer = await png.arrayBuffer();
    // const json = await axios.get(this.png, { responseType: 'arraybuffer' });
    // return json;
    return arraybuffer;
  }

  async parseJson() {
    let json = {};

    const url = this.json;
    try {
      const response = await fetch(url);
      json = await response.json();
    } catch (error) {
      return json;
    }

    return json;
  }

  parseSprite(datas) {
    const png = datas[0];
    const json = datas[1];
    if (!png || !json) {
      return {};
    }
    const base64 =
      "data:image/png;base64," +
      btoa(
        new Uint8Array(png.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
    const spriteImage = new Image();
    spriteImage.src = base64;
    const pngData = spriteImage;
    const jsonData = json.data;
    this.pngData = pngData;
    this.jsonData = jsonData;
    return { pngData, jsonData };
  }
}

export class SpriteManager {
  /**
   * @description 符号库列表
   * @type Sprite[]
   */
  list;

  constructor(list) {
    this.list = list;
  }

  getSpriteByTitle(title) {
    for (const sprite of this.list) {
      if (sprite.title === title) {
        return sprite;
      }
    }
    return undefined;
  }
}
