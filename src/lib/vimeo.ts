/**
 * Construye la URL de embed de Vimeo para reproducir en un WebView.
 * Si el video es privado, se pasa el hash via `h=`.
 */
export function buildVimeoEmbedUrl(
  vimeoId: string,
  vimeoHash?: string,
  opts: { autoplay?: boolean; playsinline?: boolean } = {},
) {
  const { autoplay = true, playsinline = true } = opts;
  const params = new URLSearchParams();
  if (vimeoHash) params.set('h', vimeoHash);
  if (autoplay) params.set('autoplay', '1');
  if (playsinline) params.set('playsinline', '1');
  params.set('dnt', '1'); // do-not-track Vimeo analytics
  params.set('title', '0');
  params.set('byline', '0');
  params.set('portrait', '0');
  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}
