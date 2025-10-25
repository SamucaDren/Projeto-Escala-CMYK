// backend/cmyk-conversor.ts
export type CMYK = {
  c: number;
  m: number;
  y: number;
  k: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export function converterRGBparaCMYK(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return { c, m, y, k };
}

export function ConverterCMYKparaRGB(cmyk: CMYK): RGB {
  const r = Math.round(255 * (1 - cmyk.c) * (1 - cmyk.k));
  const g = Math.round(255 * (1 - cmyk.m) * (1 - cmyk.k));
  const b = Math.round(255 * (1 - cmyk.y) * (1 - cmyk.k));
  return { r, g, b };
}

export const CriarListaCMYk = (base: CMYK, escala: number): CMYK[][] => {
  const tamanho = escala * 2;
  const lista: CMYK[][] = [];
  const centro = Math.floor(tamanho / 2);

  for (let l = 0; l < tamanho; l++) {
    const linha: CMYK[] = [];
    for (let c = 0; c < tamanho; c++) {
      // calcular offsets relativos ao centro
      const offsetC = Math.max(centro - c, 0); // esquerda
      const offsetY = Math.max(c - centro, 0); // direita
      const offsetM = Math.max(centro - l, 0); // cima
      const offsetK = Math.max(l - centro, 0); // baixo

      linha.push({
        c: Math.min(base.c + offsetC * 0.1, 1),
        m: Math.min(base.m + offsetM * 0.1, 1),
        y: Math.min(base.y + offsetY * 0.1, 1),
        k: Math.min(base.k + offsetK * 0.1, 1),
      });
    }
    lista.push(linha);
  }

  return lista;
};
