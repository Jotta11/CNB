import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TrackingScripts = () => {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (loading) return;

    const gtmId = settings.gtm_id;
    const ga4Id = settings.ga4_id;

    // Injeta GTM se ainda não foi carregado
    if (!document.getElementById('cnb-gtm')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.id = 'cnb-gtm';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.insertBefore(script, document.head.firstChild);

      const noscript = document.createElement('noscript');
      noscript.id = 'cnb-gtm-noscript';
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    }

    // Injeta GA4 se ainda não foi carregado
    if (!document.getElementById('cnb-ga4')) {
      const gaScript = document.createElement('script');
      gaScript.id = 'cnb-ga4';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(gaScript);

      const gaInline = document.createElement('script');
      gaInline.id = 'cnb-ga4-config';
      gaInline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`;
      document.head.appendChild(gaInline);
    }
  }, [loading, settings.gtm_id, settings.ga4_id]);

  return null;
};

export default TrackingScripts;
