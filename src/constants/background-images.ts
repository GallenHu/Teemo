const URL_BASE = 'https://static.199100.xyz/images/wallpagers/';
const fullUrls = (names: string[]) => names.map(name => (name.indexOf('http') === 0 ? name : URL_BASE + name));

export default fullUrls([
  'foggy-mountain_w 3309.webp',
  'mountain-image_w6000.webp',
  'woodland_3840.webp',
  'snow-mountain_w5084.webp',
]);
