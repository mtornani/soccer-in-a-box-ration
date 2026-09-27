import { loadFont } from "@remotion/fonts";
import React from "react";
import { Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";

// Same palette and type as the app: ration-pack khaki, olive drab, ink print,
// chalk, signal orange.
export const C = {
  pouch: "#D6C7A1",
  pouchDeep: "#BFAE80",
  drab: "#4A5431",
  ink: "#1C2116",
  chalk: "#F4F0E3",
  signal: "#D9480F",
  inkSoft: "#4B4F3E",
};

export const STENCIL = "Stencil";
export const SANS = "Archivo";

await Promise.all([
  loadFont({ family: STENCIL, url: staticFile("stencil-800.woff2"), weight: "800" }),
  loadFont({ family: SANS, url: staticFile("archivo-400.woff2"), weight: "400" }),
  loadFont({ family: SANS, url: staticFile("archivo-600.woff2"), weight: "600" }),
  loadFont({ family: SANS, url: staticFile("archivo-800.woff2"), weight: "800" }),
]);

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Text block that rises into place at frame `at` (relative to its scene). */
export const Appear: React.FC<{
  at: number;
  name: string;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, name, rise = 40, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name={name}
      style={{
        opacity: interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE }),
        translate: interpolate(frame, [at, at + 22], [`0px ${rise}px`, "0px 0px"], { ...clamp, easing: EASE }),
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};
