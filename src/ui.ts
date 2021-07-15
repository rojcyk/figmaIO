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

  /* If we in the the renderer, we are using standard JS window.onmessage function
    * and we are parsing information that came from the figma event
    * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onmessage */
  window.onmessage = (ev: any): void => receive(ev.data.pluginMessage)

  /*********************
   * SEND LOGIC
   *********************/

  emitter.send = (event: any, data: any): void => {
    /* We need to know the name of the event, otherwise we wouldn't know how to differentiate events */
    if (typeof event !== 'string') {
      throw new Error('Expected first argument to be an event name string')
    }

    const postData = { event, data }

    /* The same logic as with event listeners. if we are in the renderer, we are using
      * standard window messaging.
      * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage */
    window.parent.postMessage({ pluginMessage: postData }, '*')
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

/* The behaviour of the lib changes based on whether
 * we are running the plugin from the UI or the plugin code side */
// const isRenderer = typeof figma === 'undefined'

// export const html = createInterface(true)
// export const script = createInterface()

// export const html = isRenderer ? createInterface(true) : undefined
// export const script = isRenderer ? undefined : createInterface()
 export default createInterface()