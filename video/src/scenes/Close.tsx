import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Appear, C, clamp, EASE, SANS, STENCIL } from "../theme";

const pillars = [
  "Un sensore che misura.",
  "Un archivio sempre attivo.",
  "Ovunque, in qualunque condizione.",
];

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Close" style={{ backgroundColor: C.drab, padding: "0 96px", justifyContent: "center" }}>
      {pillars.map((p, i) => (
        <Appear key={p} at={6 + i * 18} name={p} rise={24}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 54, lineHeight: 1.25, color: C.chalk, marginBottom: 22 }}>{p}</div>
        </Appear>
      ))}
      <Appear at={70} name="Pro" style={{ marginTop: 60 }}>
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 164, lineHeight: 0.98, color: C.pouch }}>
          Lavora come un professionista.
        </div>
      </Appear>
      <Interactive.Div
        name="Rule"
        style={{
          height: 12,
          marginTop: 56,
          backgroundColor: C.signal,
          width: interpolate(frame, [96, 120], [0, 300], { ...clamp, easing: EASE }),
        }}
      />
      <Appear at={110} name="Signature" style={{ marginTop: 40 }}>
        <div style={{ fontFamily: SANS, fontSize: 44, lineHeight: 1.35, color: C.chalk }}>
          Soccer in a Box, una proposta per K-Fans.
          <br />
          Mirko Tornani, allenatore.
        </div>
      </Appear>
    </AbsoluteFill>
  );
};
