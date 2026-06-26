import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { Brand, Radius } from '@/constants/theme';

type Props = {
  vimeoId: string;
  vimeoHash?: string | null;
  onProgress?: (pct: number) => void;
  onEnded?: () => void;
  autoplay?: boolean;
};

/**
 * Envuelve el iframe de Vimeo dentro de una página HTML que servimos
 * directamente al WebView. Así podemos usar el Vimeo Player JS SDK desde el
 * documento padre (la página que servimos) para escuchar eventos
 * `timeupdate` / `seeked` / `ended` / `error` y postearlos a React Native.
 */
function buildHtml(vimeoId: string, vimeoHash: string | undefined, autoplay: boolean) {
  const params = new URLSearchParams();
  if (vimeoHash) params.set('h', vimeoHash);
  if (autoplay) params.set('autoplay', '1');
  params.set('playsinline', '1');
  params.set('dnt', '1');
  params.set('title', '0');
  params.set('byline', '0');
  params.set('portrait', '0');
  const src = `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;

  // El SDK se carga en el documento padre. Crea un Player a partir del iframe.
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <style>
    html, body { margin: 0; padding: 0; background: #6B5848; height: 100%; }
    .frame { position: absolute; inset: 0; }
    iframe { width: 100%; height: 100%; border: 0; display: block; }
  </style>
</head>
<body>
  <div class="frame">
    <iframe id="vimeo" src="${src}" frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen></iframe>
  </div>
  <script src="https://player.vimeo.com/api/player.js"></script>
  <script>
    (function() {
      function post(msg) {
        try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch (_) {}
      }
      function ready() {
        try {
          var iframe = document.getElementById('vimeo');
          if (!iframe || !window.Vimeo) { post({ type: 'error', error: 'no-sdk-or-iframe' }); return; }
          var player = new window.Vimeo.Player(iframe);
          player.ready().then(function() { post({ type: 'ready' }); }).catch(function(e) {
            post({ type: 'error', error: String(e) });
          });
          player.on('timeupdate', function(d) {
            post({ type: 'progress', seconds: d.seconds, duration: d.duration, percent: d.percent });
          });
          player.on('seeked', function(d) {
            post({ type: 'progress', seconds: d.seconds, duration: d.duration, percent: d.percent });
          });
          player.on('ended', function() { post({ type: 'ended' }); });
          player.on('error', function(err) { post({ type: 'error', error: JSON.stringify(err) }); });
        } catch (e) { post({ type: 'error', error: String(e) }); }
      }
      if (window.Vimeo) ready(); else window.addEventListener('load', ready);
    })();
  </script>
</body>
</html>`;
}

export function VimeoPlayer({
  vimeoId,
  vimeoHash,
  onProgress,
  onEnded,
  autoplay = false,
}: Props) {
  const html = useMemo(
    () => buildHtml(vimeoId, vimeoHash ?? undefined, autoplay),
    [vimeoId, vimeoHash, autoplay],
  );

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'progress' && typeof msg.percent === 'number') {
        onProgress?.(msg.percent * 100);
      } else if (msg.type === 'ended') {
        // Algunos navegadores no emiten 'ended' tras seek al final; el caller
        // también recibe progress al 100%, pero llamamos ambos por seguridad.
        onProgress?.(100);
        onEnded?.();
      } else if (msg.type === 'error') {
        // eslint-disable-next-line no-console
        console.warn('[VimeoPlayer]', msg.error);
      }
    } catch {
      // ignorar
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://player.vimeo.com' }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onMessage={onMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    backgroundColor: Brand.charcoal,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
