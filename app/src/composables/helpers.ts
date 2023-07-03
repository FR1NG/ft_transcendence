import { resolve } from "path";

export function resetObject(object: any) {
  if(!(object instanceof Object))
    return;
  for (const [key, value] of Object.entries(object)) {
    if(typeof value === 'string')
      object[key] = '';
    else if (typeof value === 'number')
      object[key] = 0;
    else if (typeof value === 'undefined')
      object[key] = undefined;
    else if (typeof value === 'object')
     resetObject(object[key]);
    else
      object[key] = null;
  }
}

export function assignObject(src: any, dst: any) {
  for (const key in src) {
    if(dst.hasOwnProperty(key))
      dst[key] = src[key];
  }
}

export function timeout(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}
