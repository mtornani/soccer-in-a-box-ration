import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear, C, clamp, EASE, SANS, STENCIL } from "../theme";

// Illustrative numbers only: labelled as such on screen.
const metrics = [
  { label: "Velocità massima", value: 31.4, decimals: 1, unit: "km/h" },
  { label: "Accelerazioni", value: 14, decimals: 0, unit: "" },
  { label: "Distanza ad alta intensità", value: 420, decimals: 0, unit: "m" },
];

const Count: React.FC<{ at: number; value: number; decimals: number }> = ({ at, value, decimals }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 36], [0, value], { ...clamp, easing: EASE });
  return <>{v.toFixed(decimals).replace(".", ",")}</>;
};

export const Together: React.FC = () => {
  return (
    <AbsoluteFill name="Together" style={{ backgroundColor: C.chalk, padding: "170px 96px 0" }}>
      <Appear at={4} name="Measures">
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 138, lineHeight: 1, color: C.ink }}>K-Fans misura.</div>
      </Appear>
      <Appear at={26} name="Trains" style={{ marginTop: 12 }}>
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 138, lineHeight: 1, color: C.drab }}>La razione allena.</div>
      </Appear>

      <Appear at={56} name="Phase label" style={{ marginTop: 96 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.inkSoft }}>Fase 4, sprint ripetuti</div>
      </Appear>
      <div style={{ marginTop: 26 }}>
        {metrics.map((m, i) => (
          <Appear key={m.label} at={64 + i * 12} name={m.label} rise={30}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "30px 0",
                borderTop: `4px solid ${C.ink}`,
              }}
            >
              <span style={{ fontFamily: SANS, fontSize: 46, color: C.ink, maxWidth: 440, lineHeight: 1.2 }}>{m.label}</span>
              <span style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 150, lineHeight: 0.9, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
                <Count at={70 + i * 12} value={m.value} decimals={m.decimals} />
                {m.unit && <span style={{ fontSize: 60, marginLeft: 14, color: C.inkSoft }}>{m.unit}</span>}
              </span>
            </div>
          </Appear>
        ))}
      </div>
      <Appear at={120} name="Fit" style={{ marginTop: 40 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, lineHeight: 1.3, color: C.ink }}>
          L'obiettivo della fase, verificato dal dato.
        </div>
      </Appear>
      <Appear at={120} name="Disclaimer" style={{ position: "absolute", bottom: 110, left: 96 }}>
        <div style={{ fontFamily: SANS, fontSize: 32, color: C.inkSoft }}>Dati illustrativi</div>
      </Appear>
      <FadeBar />
    </AbsoluteFill>
  );
};

// thin signal bar that fills while the numbers count, drawing the eye down
const FadeBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 14,
        backgroundColor: C.signal,
        width: `${interpolate(frame, [0, 250], [0, 100], clamp)}%`,
      }}
    />
  );
};
