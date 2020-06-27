# figmaIO

The purpose of this package is to make the [communication](https://www.figma.com/plugin-docs/how-plugins-run/) between your code and your [Figma plugin](https://www.figma.com/plugin-docs/intro/) easier. It achieves this by creating a very simple interfac.

First, you need to differentiate whether you are using the library in the Figma code, or in figma UI.

```js
/* In your are in the plugin logic (code) */
import { script as io } from 'figmaio'

/*f you are in the UI */
import { html as io } from 'figmaio'
```

So in your UI, you can triggerr the event like this

```js
/* Because of the lib nature (it can exist in both 
 * rendered and the plugin logic) you need to check for its existence. */

if (io) {
/* What is the name of the event that is happening? Can be anything */
  io.send('data_update', {
     /* any object you want */
   })
}
```

Here is an example how you would use the library in your plugin code logic.

```js
/* In your Figma plugin logic like code.js */

import { script as io } from 'figma-io'

export const updateListener = () => {
  /* Event name, it can by anything */
  io.on('data_update', (data: any): void => {
      // Here you can do anything you want with the data
      console.log(data)
    }
  )
}
```

