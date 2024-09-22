export const setItem = (key: string, value: string | object) => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const getItem = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
