export function setColor(index: number): string {
  const color = ['accent', 'primary', 'info', 'warning', 'positive', 'custom'];
  return color[index % color.length];
}
