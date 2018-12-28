<img src="public/img/logo/logo.png" height="160" width="160">

# Color Breakdown

*Extract prominent colors from an image to create more visually engaging designs and apps.*

Good visual design is essential for a successful app or site, and color schemes are a primary component of designs. Color Breakdown breaks down an image into the most prominent colors so you can use them in your designs. For example, you can create color-coordinated title cards for a song based on its album cover or adjust an app's toolbar color when its background image changes. Six main color profiles from the bitmap are extracted to help inform your design choices.

When you're ready to build your design, quickly copy colors by just clicking on the palettes for each image. Save a list of previously processed images so you can refer to other color swatches easily.

---

[Color Breakdown](https://notwoods.github.io/color-breakdown) is [node-vibrant](https://github.com/akfish/node-vibrant)'s missing GUI, aiming to expose the configuration options of node-vibrant. node-vibrant ports the [Android Palette class](https://developer.android.com/training/material/palette-colors.html) to JavaScript, allowing you to extract prominent colors from images. Use these colors in your own designs to create more visually engaging designs and apps.

Inspired by [SVGOMG](https://jakearchibald.github.io/svgomg/)!

## Feature requests

[Check out the issues](https://github.com/NotWoods/color-breakdown/issues) to see what's planned, or suggest ideas of your own!

## Developing

### Built with
- [node-vibrant 3.0.0](https://github.com/akfish/node-vibrant)
- [idb 2.1.3](https://github.com/jakearchibald/idb)
- Web Workers
- Service Workers

### Setting up Dev
Install dependencies:

```shell
npm install
```

Run dev server:

```shell
npm run build
npm start
```

## Licensing
This project is available under the MIT License.
