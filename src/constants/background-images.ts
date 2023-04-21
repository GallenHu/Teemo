const URL_BASE = 'https://static.199100.xyz/images/wallpagers/';
const fullUrls = (names: string[]) => names.map(name => (name.indexOf('http') === 0 ? name : URL_BASE + name));

export default fullUrls([
  'woodland_3840.webp',
  'foggy-mountain_w3309.webp',
  'mountain-image_w6000.webp',
  'snow-mountain_w5084.webp',
]);
