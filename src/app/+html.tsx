import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Plantilla HTML personalizada para la versión web (estática) de la app.
 * - Enlaza el manifest PWA (instalable en iPhone/Android)
 * - Define el color de tema (terracota de marca) y meta viewport
 * - Registra el service worker en producción para activar la instalación
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" content="#B5673F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mape Antonia" />

        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/assets/images/icon.png" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: rootStyle }} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/service-worker.js').catch(function () {
                    /* sin red — ignorar */
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

const rootStyle = `
  html, body { background-color: #FBF8F3; }
  body { overscroll-behavior-y: none; }
`;
