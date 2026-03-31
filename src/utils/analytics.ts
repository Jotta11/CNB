declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackWhatsApp(local: string) {
  push({ event: 'whatsapp_click', local });
}

export function trackScrollDepth(porcentagem: number, pagina: string) {
  push({ event: 'scroll_profundidade', porcentagem, pagina });
}

export function trackLoteClick(params: {
  lote_id: string;
  lote_numero: string;
  lote_titulo: string;
  acao: 'card_imagem' | 'ver_lote' | 'whatsapp';
}) {
  push({ event: 'lote_click', ...params });
}

export function trackNoticiaClick(params: {
  noticia_slug: string;
  noticia_titulo: string;
  acao: 'titulo' | 'ler_materia';
}) {
  push({ event: 'noticia_click', ...params });
}

export function trackFormInicio(tipo: string) {
  push({ event: 'form_inicio', tipo_formulario: tipo });
}

export function trackFormSubmit(tipo: string) {
  push({ event: 'form_submit', tipo_formulario: tipo });
}

export function trackPageView(pagina: string) {
  push({ event: 'page_view', pagina });
}

export function trackFAQAberta(pergunta: string, indice: number) {
  push({ event: 'faq_aberta', pergunta, indice });
}
