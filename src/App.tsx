// src/App.tsx
import React, { useState } from "react";
import {
  CMYK,
  ConverterCMYKparaRGB,
  CriarListaCMYk,
} from "./backend/cmyk-services";

const App: React.FC = () => {
  // armazenamos em 0-100 para facilitar o input
  const [c, setC] = useState(0);
  const [m, setM] = useState(100);
  const [y, setY] = useState(100);
  const [k, setK] = useState(0);
  const [escala, setEscala] = useState(5);

  // converte para 0-1 antes de enviar para as funções
  const cmyk: CMYK = { c: c / 100, m: m / 100, y: y / 100, k: k / 100 };
  const listaCMYK = CriarListaCMYk(cmyk, escala);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Variações de CMYK</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <label>
          C%:{" "}
          <input
            type="number"
            min={0}
            max={100}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
          />
        </label>
        <label>
          M%:{" "}
          <input
            type="number"
            min={0}
            max={100}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
          />
        </label>
        <label>
          Y%:{" "}
          <input
            type="number"
            min={0}
            max={100}
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
          />
        </label>
        <label>
          K%:{" "}
          <input
            type="number"
            min={0}
            max={100}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
        </label>
        <label>
          Escala:{" "}
          <input
            type="number"
            min={1}
            max={10}
            value={escala}
            onChange={(e) => setEscala(Number(e.target.value))}
          />
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gap: "8px",
          gridTemplateColumns: `repeat(${escala * 2}, 80px)`,
        }}
      >
        {listaCMYK.map((linha, i) =>
          linha.map((cmykItem, j) => {
            const rgb = ConverterCMYKparaRGB(cmykItem);
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  width: "80px",
                  textAlign: "center",
                  border: "1px solid #000",
                  padding: "4px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    marginBottom: "4px",
                  }}
                  title={`C:${(cmykItem.c * 100).toFixed(0)} M:${(
                    cmykItem.m * 100
                  ).toFixed(0)} Y:${(cmykItem.y * 100).toFixed(0)} K:${(
                    cmykItem.k * 100
                  ).toFixed(0)}`}
                />
                <div style={{ fontSize: "10px" }}>
                  C:{(cmykItem.c * 100).toFixed(0)}% <br />
                  M:{(cmykItem.m * 100).toFixed(0)}% <br />
                  Y:{(cmykItem.y * 100).toFixed(0)}% <br />
                  K:{(cmykItem.k * 100).toFixed(0)}%
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
