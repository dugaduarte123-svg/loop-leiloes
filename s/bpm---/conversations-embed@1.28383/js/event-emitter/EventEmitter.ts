// @ts-ignore Frontend Platform doesn't support importing types from vendored deps
import EventEmitter3 from '../../vendor/eventemitter3.min.js';
import { stringInvariant } from '../invariants/stringInvariant';
import { functionInvariant } from '../invariants/functionInvariant';
import { EVENT_NAMESPACE } from './constants/eventEmitterConstants';
import { eventTypeInvariant } from './invariants/eventTypeInvariant';
class EventEmitter {
  constructor() {
    this._eventEmitter = new EventEmitter3();
    this._namespacedEventType = this._namespacedEventType.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.trigger = this.trigger.bind(this);
  }
  _namespacedEventType(rawEventType) {
    return `${EVENT_NAMESPACE}:${rawEventType}`;
  }

  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener
   * @param {string} rawEventType - Name of the event to listen for
   * @param {function} listener - Function to be called when the event is triggered
   */
  on(rawEventType, listener) {
    stringInvariant(rawEventType);
    functionInvariant(listener);
    if (!rawEventType.length) {
      return;
    }
    const eventType = this._namespacedEventType(rawEventType);
    this._eventEmitter.addListener(eventType, listener);
  }

  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
   * @param {string} rawEventType - Name of the event for which the listener will be removed
   * @param {function} listener - The listener to remove
   */
  off(rawEventType, listener) {
    stringInvariant(rawEventType);
    functionInvariant(listener);
    if (!rawEventType.length) {
      return;
    }
    const eventType = this._namespacedEventType(rawEventType);
    this._eventEmitter.removeListener(eventType, listener);
  }

  /*
   * Proxy of https://nodejs.org/api/events.html#events_emitter_emit_eventname_args
   * @param {string} rawEventType - Name of the event to be triggered
   * @param {object} [payload] - Data to be sent with the event
   */
  trigger(rawEventType, payload) {
    eventTypeInvariant(rawEventType);
    const eventType = this._namespacedEventType(rawEventType);
    this._eventEmitter.emit(eventType, payload);
  }
}
export default EventEmitter;