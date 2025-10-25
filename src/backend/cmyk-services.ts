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
  // --- Conversão base ---
  const C = cmyk.c;
  const M = cmyk.m;
  const Y = cmyk.y;
  const K = cmyk.k;

  // --- 1. Compensação de ponto de ganho (dot gain ≈ 15%) ---
  const dotGain = 0.15;
  const Cg = C + (1 - C) * dotGain * C;
  const Mg = M + (1 - M) * dotGain * M;
  const Yg = Y + (1 - Y) * dotGain * Y;

  // --- 2. Conversão com correção perceptiva ---
  let r = 255 * Math.pow(1 - Math.min(1, Cg * (1 - K) + K), 1 / 1.6);
  let g = 255 * Math.pow(1 - Math.min(1, Mg * (1 - K) + K), 1 / 1.6);
  let b = 255 * Math.pow(1 - Math.min(1, Yg * (1 - K) + K), 1 / 1.6);

  // --- 3. Correção de balanço de cor (para remover esverdeamento e puxar tons mais reais) ---
  r *= 0.95; // reduz leve excesso de vermelho
  g *= 0.92; // reduz tendência ao verde
  b *= 1.05; // reforça o azul, mais fiel ao CMYK real

  // --- 4. Ajuste leve de contraste global ---
  const contraste = 1.08;
  r = Math.pow(r / 255, contraste) * 255;
  g = Math.pow(g / 255, contraste) * 255;
  b = Math.pow(b / 255, contraste) * 255;

  // --- 5. Clamp final ---
  return {
    r: Math.min(255, Math.max(0, Math.round(r))),
    g: Math.min(255, Math.max(0, Math.round(g))),
    b: Math.min(255, Math.max(0, Math.round(b))),
  };
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
