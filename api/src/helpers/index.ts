export function replacePlaceHolder(str: string, object) {
  for(const key in object) {
    const regex = new RegExp(`\\$${key}`, 'g');
    str = str.replace(regex, object[key])
  }
  return str;
}
