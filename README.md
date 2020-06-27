# figmaIO

The purpose of this package is to make the [communication](https://www.figma.com/plugin-docs/how-plugins-run/) between your code and your [Figma plugin](https://www.figma.com/plugin-docs/intro/) easier. It achieves this by creating a very simple interfac.

First, you need to differentiate whether you are using the library in the Figma code, or in figma UI. This is important, because if you won't be using the right component for the right section of the code, the lib won't work.

```js
/* In your are in the plugin logic (code) */
import { script as io } from 'figmaio';

/* If you are in the UI */
import { html as io } from 'figmaio';
```

## How to use

Now, the whole library is about two simple events. Sending data, and recieving data. You send the data like this:

```js
/* What is the name of the event that is happening? Can be anything */
io.send('data_update', {
   /* any object you want */
});
```

And then you listen for data like this:

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
  /* code.js */
  
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
 
    case '':
      if (io) io.send('start', cachedData);
      break
    case 'edit':
      if (io) io.send('start', cachedData);
      break
  }
```

Once my plugin determines whether we have cached data or not, it sends it over to the ui. There:

```js
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

```js
/* ui.js */  
import { script as io } from 'figmaio';

export const updateListener = () => {
  /* Event name, it can by anything */
  io.on('data_update', (data: any): void => {
      // Here you can do anything you want with the data
      console.log(data);
    }
  );
};
```

The whole library work both ways. So not that you can send message from UI to the code, but from code to the  So you can do something similar like I do, in my plugin initialization:

```js

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
 
    case '':
      io.send('start', cachedData);
      break
    case 'edit':
      io.send('start', cachedData);
      break
  }
```

and then in the UI file:


```js
  /* I'm waiting for the event with 'start' message to arrive from code.js
   * and the moment it arrives I'll continue with the app rendering.
   */
   
  const data = (await io.async('start'))

  const htmlID = 'react-page';
  const node = document.getElementById(htmlID);

  if (!node) throw new Error(`Node  ${htmlID} exists `)

  ReactDOM.render(
    <App data={data} />,
    node,
  );
```

## Listeners

And that is the basic gist of it. But lets say that you need to update saved information in Figma, and you need to send the updated data directly from the UI. You can do it like this:

```js
  /* UI file */

  import { html as io } from 'figmaio';
  
  io.send('event_name', {
    /* any object you need */
  });
```

And then in the code I create listeners like this:

```js
/* CODE file */

import { script as io } from 'figmaio';

export const updateListener = () => {
  io.on('data_update', (data: any): void => {
      // Here you can do anything you want with the data
      console.log(data);
    }
  );
};
```

and I include these in the main code.js file:

```js
/* previously shown code.js */

 udpateListener()
```

## Footnotes

I saw the original idea of this lib sometimes early in 2019 on [Figma Spectrum](https://spectrum.chat/figma?tab=posts). I copied it over to my code and now a year later I need to keep using it with my other projects. So I decided to put it out as a standalone lib. 
