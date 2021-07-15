/* The whole project was heavily inspired by some person on Figma Spectrum sometimes
 * early in 2019. I would love to credit the person who came with this whole concept but have no idea who it was.
 */
import { EventEmitter } from 'events'

/* We are extending the standard EventEmitter with our helpers functions */
interface ExtendedEmitter extends EventEmitter {
  send: Function
  async: Function
}

/* The whole logic changes based on whether we are running the emmiter in
 * the renderer or in the code side of the plugin. */
function createInterface(): ExtendedEmitter {
  const emitter = new EventEmitter() as ExtendedEmitter

  /*********************
   * RECEIVE LOGIC
   *********************/

  const receive = (result: any): void => {
    /* If we've recieved an event, that has a name then emit the event */
    if (result && result.event) emitter.emit(result.event, result.data)
  }

  /* But if we are in the code part of figma, we are using custom figma listener.
  * and we are listening for data coming from window
  * Refer to https://www.figma.com/plugin-docs/api/figma-ui/#onmessage for more information */
  figma.ui.onmessage = (data): void => receive(data)

  /*********************
   * SEND LOGIC
   *********************/

  emitter.send = (event: any, data: any): void => {
    /* We need to know the name of the event, otherwise we wouldn't know how to differentiate events */
    if (typeof event !== 'string') {
      throw new Error('Expected first argument to be an event name string')
    }

    const postData = { event, data }

    /* And if we are in the code part of the plugin, we are using Figma post message 
      * https://www.figma.com/plugin-docs/api/figma-ui/#postmessage */
    figma.ui.postMessage(postData)
  }

  /*********************
   * ASYNC SUPPORT
   *********************/

  emitter.async = function(ev: any): Promise<void> {
    return new Promise((resolve): void => {
      this.once(ev, resolve)
    })
  }

  /*********************
   * RETURN
   *********************/

  return emitter
}

export default createInterface()