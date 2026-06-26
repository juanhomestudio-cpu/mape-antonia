import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';

type Props = {
  vimeoId: string;
  vimeoHash?: string | null;
  onProgress?: (pct: number) => void;
  onEnded?: () => void;
  autoplay?: boolean;
};

function buildSrc(vimeoId: string, vimeoHash: string | undefined, autoplay: boolean) {
  const params = new URLSearchParams();
  if (vimeoHash) params.set('h', vimeoHash);
  if (autoplay) params.set('autoplay', '1');
  params.set('playsinline', '1');
  params.set('dnt', '1');
  params.set('title', '0');
  params.set('byline', '0');
  params.set('portrait', '0');
  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}

/**
 * Versión web del VimeoPlayer: en web no existe react-native-webview.
 * Insertamos directamente un <iframe> y escuchamos los eventos del Vimeo
 * Player SDK por postMessage entre window y el iframe.
 */
export function VimeoPlayer({
  vimeoId,
  vimeoHash,
  onProgress,
  onEnded,
  autoplay = false,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const src = useMemo(() => buildSrc(vimeoId, vimeoHash ?? undefined, autoplay), [
    vimeoId,
    vimeoHash,
    autoplay,
  ]);

  useEffect(() => {
    // Cargar Vimeo Player SDK desde CDN si no está ya cargado.
    const existing = document.querySelector<HTMLScriptElement>('#vimeo-player-sdk');
    let cleanup = () => {};

    function attach() {
      const w = window as any;
      if (!iframeRef.current || !w.Vimeo) return;
      const player = new w.Vimeo.Player(iframeRef.current);
      const onTime = (d: { seconds: number; duration: number; percent: number }) => {
        onProgress?.(d.percent * 100);
      };
      const onEnd = () => {
        onProgress?.(100);
        onEnded?.();
      };
      player.on('timeupdate', onTime);
      player.on('seeked', onTime);
      player.on('ended', onEnd);
      cleanup = () => {
        try {
          player.off('timeupdate', onTime);
          player.off('seeked', onTime);
          player.off('ended', onEnd);
        } catch {
          /* ignorar */
        }
      };
    }

    if (existing) {
      attach();
    } else {
      const script = document.createElement('script');
      script.id = 'vimeo-player-sdk';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = attach;
      document.head.appendChild(script);
    }
    return () => cleanup();
  }, [onProgress, onEnded, src]);

  return (
    <View style={styles.container}>
      {/* iframe es un elemento DOM, no nativo de RN, pero se renderiza en web. */}
      {(() => {
        const IFrameAny = 'iframe' as any;
        return (
          <IFrameAny
            ref={iframeRef}
            src={src}
            style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      })()}
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
});
