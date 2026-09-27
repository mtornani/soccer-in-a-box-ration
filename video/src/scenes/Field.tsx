import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, clamp, EASE, SANS, STENCIL } from "../theme";

// Recreates the app's field screen (ration 01, phase 4) inside a phone.
const Timer: React.FC = () => {
  const frame = useCurrentFrame();
  const left = 600 - Math.floor(frame / 6);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 210, lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
      {mm}:{ss}
    </div>
  );
};

const PitchMap: React.FC = () => {
  const frame = useCurrentFrame();
  // player sprints cone to cone, walks back: 60-frame loop
  const t = frame % 60;
  const x = t < 24
    ? interpolate(t, [0, 24], [30, 165], { easing: EASE })
    : interpolate(t, [24, 60], [165, 30]);
  return (
    <svg viewBox="0 10 200 90" style={{ display: "block", width: "100%", backgroundColor: C.drab }}>
      <rect x="4" y="14" width="192" height="82" fill="none" stroke={C.chalk} strokeWidth="1.2" opacity="0.6" />
      <line x1="40" y1="55" x2="165" y2="55" stroke={C.chalk} strokeWidth="1.4" strokeDasharray="4 3" />
      <path d="M26 59L30 51L34 59Z" fill={C.signal} />
      <path d="M166 59L170 51L174 59Z" fill={C.signal} />
      <circle cx={x} cy="55" r="5.5" fill={C.pouch} />
    </svg>
  );
};

export const Field: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [170, 196], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill name="Field" style={{ backgroundColor: C.drab }}>
      <div style={{ position: "absolute", top: 140, left: 96, right: 96, height: 250 }}>
        <Interactive.Div name="Headline A" style={{ position: "absolute", opacity: interpolate(frame, [4, 18, 150, 162], [0, 1, 1, 0], clamp) }}>
          <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 112, lineHeight: 1.02, color: C.chalk }}>
            Apri. Segui le fasi.
          </div>
        </Interactive.Div>
        <Interactive.Div name="Headline B" style={{ position: "absolute", opacity: interpolate(frame, [164, 180], [0, 1], clamp) }}>
          <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 112, lineHeight: 1.02, color: C.chalk }}>
            Ogni fase dice cosa misurare.
          </div>
        </Interactive.Div>
      </div>

      <Interactive.Div
        name="Phone"
        style={{
          position: "absolute",
          left: 120,
          width: 840,
          top: 430,
          height: 1600,
          borderRadius: 96,
          backgroundColor: C.ink,
          padding: 26,
          translate: interpolate(frame, [0, 30], ["0px 400px", "0px 0px"], { ...clamp, easing: EASE }),
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 72, overflow: "hidden", backgroundColor: C.pouch }}>
          <div style={{ padding: "56px 44px 22px", backgroundColor: C.drab, fontFamily: STENCIL, fontWeight: 800, fontSize: 44, color: C.chalk }}>
            Soccer in a Box
          </div>
          <div style={{ margin: 30, padding: 34, backgroundColor: C.chalk, border: `4px solid ${C.ink}` }}>
            <div style={{ fontFamily: SANS, fontSize: 30, color: C.inkSoft }}>Razione 01, fase 4 di 5</div>
            <Timer />
            <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 70, color: C.ink, margin: "0 0 18px" }}>
              Sprint ripetuti
            </div>
            <PitchMap />
            <div style={{ fontFamily: SANS, fontSize: 34, lineHeight: 1.35, color: C.ink, margin: "24px 0 20px" }}>
              8 sprint da 20 metri alla massima velocità. Rientro camminando.
            </div>
            <div style={{ padding: "14px 20px", borderLeft: `8px solid ${C.ink}`, backgroundColor: C.pouch, fontFamily: SANS, fontSize: 32, color: C.ink, opacity: 1 - focus * 0.6 }}>
              <div style={{ fontWeight: 800, fontSize: 26 }}>Obiettivo</div>
              8 sprint alla massima velocità
            </div>
            <Interactive.Div
              name="Metrics box"
              style={{
                marginTop: 18,
                padding: "14px 20px",
                borderLeft: `8px solid ${C.signal}`,
                backgroundColor: C.pouch,
                fontFamily: SANS,
                fontSize: 32,
                color: C.ink,
                outline: `${focus * 6}px solid ${C.signal}`,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 26 }}>Da misurare</div>
              velocità massima, accelerazioni, distanza ad alta intensità
            </Interactive.Div>
          </div>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
