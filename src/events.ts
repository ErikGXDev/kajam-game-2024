// kaplay please fix

import { k } from "./kaplay";

const root = k.getTreeRoot();

export function onEvent(event: string, callback: (...args: any) => void) {
  return root.on(event, callback);
}

export function triggerEvent(event: string, ...args: any) {
  return root.trigger(event, args);
}
