export const merge = (o1: object, o2: object): object => {
  const o = {};

  for (let key in o1) {
    // @ts-ignore
    o[key] = o1[key];
  }

  for (let key in o2) {
    // @ts-ignore
    o[key] = o2[key];
  }

  return o;
}
