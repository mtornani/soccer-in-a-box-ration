import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Appear, C, clamp, EASE, SANS, STENCIL } from "../theme";

const phases: [string, string][] = [
  ["Attivazione", "6′"],
  ["Muro: passa e controlla", "10′"],
  ["Slalom e cambio di senso", "8′"],
  ["Sprint ripetuti", "10′"],
  ["Defaticamento", "6′"],
];

export const Ration: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Ration" style={{ backgroundColor: C.pouch, padding: "150px 96px 0" }}>
      <Appear at={4} name="Brand">
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 64, color: C.drab }}>Soccer in a Box</div>
      </Appear>
      <Appear at={12} name="Headline" style={{ marginTop: 20 }}>
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: C.ink }}>
          L’allenamento, già pronto in tasca.
        </div>
      </Appear>

      <Interactive.Div
        name="Label"
        style={{
          marginTop: 72,
          border: `5px solid ${C.ink}`,
          backgroundColor: C.chalk,
          translate: interpolate(frame, [26, 50], ["0px 260px", "0px 0px"], { ...clamp, easing: EASE }),
          opacity: interpolate(frame, [26, 38], [0, 1], clamp),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "30px 44px", backgroundColor: C.ink }}>
          <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 220, lineHeight: 0.82, color: C.pouch }}>01</div>
          <div>
            <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 76, lineHeight: 1, color: C.chalk }}>
              Da solo, ovunque
            </div>
            <div style={{ fontFamily: SANS, fontSize: 40, marginTop: 10, color: C.pouch }}>1 giocatore, 40 minuti</div>
          </div>
        </div>
        <div style={{ padding: "30px 44px 40px" }}>
          {phases.map(([t, d], i) => (
            <Appear key={t} at={48 + i * 9} name={t} rise={20}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: SANS,
                  fontSize: 46,
                  padding: "16px 0",
                  borderBottom: `3px dashed ${C.pouchDeep}`,
                  color: C.ink,
                }}
              >
                <span>
                  <span style={{ color: C.inkSoft }}>{i + 1}. </span>
                  {t}
                </span>
                <span style={{ fontWeight: 800 }}>{d}</span>
              </div>
            </Appear>
          ))}
          <Appear at={100} name="Kit" rise={20}>
            <div style={{ fontFamily: SANS, fontSize: 40, marginTop: 26, color: C.inkSoft }}>
              Serve: un pallone, un muro, 4 segnali.
            </div>
          </Appear>
        </div>
      </Interactive.Div>

      <Appear at={122} name="Offline" style={{ position: "absolute", bottom: 130, left: 96, right: 96 }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, color: C.ink }}>
          Dopo il primo avvio, funziona senza rete.
        </div>
      </Appear>
    </AbsoluteFill>
  );
};
