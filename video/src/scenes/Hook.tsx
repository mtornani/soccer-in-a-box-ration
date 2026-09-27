import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Appear, C, clamp, EASE, SANS, STENCIL } from "../theme";

const lines = ["Niente campo.", "Niente staff.", "Niente rete."];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      name="Hook"
      style={{ backgroundColor: C.ink, padding: "0 96px", justifyContent: "center" }}
    >
      <Interactive.Div
        name="Excuses"
        style={{
          opacity: interpolate(frame, [96, 112], [1, 0.28], clamp),
        }}
      >
        {lines.map((l, i) => (
          <Appear key={l} at={6 + i * 22} name={l}>
            <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 136, lineHeight: 1.05, color: C.chalk }}>
              {l}
            </div>
          </Appear>
        ))}
      </Interactive.Div>
      <Appear at={100} name="No excuses" style={{ marginTop: 72 }}>
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 176, lineHeight: 1, color: C.pouch }}>
          Nessuna scusa.
        </div>
        <Interactive.Div
          name="Underline"
          style={{
            height: 16,
            marginTop: 28,
            backgroundColor: C.signal,
            width: interpolate(frame, [112, 132], [0, 620], { ...clamp, easing: EASE }),
          }}
        />
      </Appear>
      <Appear at={120} name="Kicker" style={{ position: "absolute", bottom: 150, left: 96 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.pouch }}>
          Per chi allena il calcio, ovunque.
        </div>
      </Appear>
    </AbsoluteFill>
  );
};
