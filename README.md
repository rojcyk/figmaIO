<p align="center">
  <img src="./logo.png">
</p>

# About

![David](https://img.shields.io/david/dev/rojcyk/figmaIO)
![npm](https://img.shields.io/npm/dm/figmaio)


The way Figma communicates with its plugins is quite different to what you might be used to from other tools. It goes something like this.

- **Plugin UI** - Are written using JavaScript, HTML and CSS. **`This exposes a very browser-like environment`**.
- **Plugin Code** - For performance, the code itself runs on the main thread in a sandbox. The sandbox is a minimal JavaScript environment and **`does not expose browser APIs`.**

So basically, in the plugin UI, you deal with the user interaction (all the buttons, sliders and inputs). And in code, you deal with the code execution and interaction with the canvas (removing layers, changing layers, whatever you want to do). So to make all of this happen, you need to send data over to each othe. [Figma has an API](https://www.figma.com/plugin-docs/api/properties/figma-ui-onmessage/) for this, but I don't like it that much and I find it clunky to use. This library aims to make it easier to do.

## Installation

Very simple to do, just install it via `npm install figmaio` or `yarn add figmaio`.

## How to use

First, you need to differentiate whether you are using the library in the Figma Code, or in Figma UI. This is important, because if you won't be using the right component for the right section of the code it will break your build process. _(it breakes the process because Figma code is not available in the browser API and the browser API in the Figma code)_


```js
/* In your are in the plugin logic (code) */
import io from 'figmaio/code';

/* If you are in the UI */
import io from 'figmaio/ui';
```

### Sending events

This is pretty straight forward to do. Just use the `io.send` and pass two parameters into it. The event name, and the data.

```js
/* What is the name of the event that is happening? Can be anything */
io.send('data_update', {
   /* any object you want */
});
```

### Listening for events

Waiting for events is just as easy. Use the `io.on` function, and pass in the event name, and do whatever you need to do in the callback.

```js
/* What event name are you waiting for? */
io.on('data_update', (data) => {
    // Here you can do anything you want with the data
    console.log(data);
  }
);
```

If the data is critical for you and you need to stop and wait for it, you use async for that.

```js
const data = await io.async('data_update')
```

## Examples

Now, the way I use this library is as follow. In my code.js I do something similar to this:

```js
/* CODE.js */

import { script as io } from 'figmaio';

figma.showUI(__html__, {
 width: 320,
 height: 480,
});

/* Caching covering logic */
const cachedData = 'some cached data'

switch (figma.command) {
   /* If we are running the plugin from the Figma plugin menu, it is starting with no command.
   * And if you are clicking on the editor sidebar plugin command, figma starts the plugin
   * with 'edit' value for command, but since my plugin does not directly benefit from it, it just
   * sends it with 'start' anyways.
   */

 case 'edit':
   if (io) io.send('start', cachedData);
   break
 default:
   if (io) io.send('start', cachedData);
   break
}
```

Once my plugin determines whether we have cached data or not, it sends it over to the ui. There I ...

```js
/* UI.js */

import { html as io } from 'figmaio';

/* I'm waiting for the event with 'start' message to arrive from code.js
* and the moment it arrives I'll continue with the app rendering.
*/

const data = (await io.async('start'))

const htmlID = 'react-page'
const node = document.getElementById(htmlID)

if (!node) throw new Error(`Node  ${htmlID} exists `)

ReactDOM.render(
 <App data={data} />,
 node,
)
```

## Footnotes

I saw the original idea of this lib sometimes early in 2019 on [Figma Spectrum](https://spectrum.chat/figma?tab=posts) (or maybe it was a Figma Slack), but I don't remember who came up with it. I copied it over to my code and now a year later I need to keep using it with my other projects. So I decided to clean it out a bit, comment it, and put it out as a standalone lib.
