import { AbsoluteFill } from "remotion";
import { Appear, C, SANS, STENCIL } from "../theme";

export const Question: React.FC = () => {
  return (
    <AbsoluteFill name="Question" style={{ backgroundColor: C.ink, padding: "0 96px", justifyContent: "center" }}>
      <Appear at={6} name="Goal">
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, lineHeight: 1.3, color: C.pouch }}>
          Obiettivo: 8 sprint alla massima velocità.
        </div>
      </Appear>
      <Appear at={34} name="Who measures" style={{ marginTop: 56 }}>
        <div style={{ fontFamily: STENCIL, fontWeight: 800, fontSize: 168, lineHeight: 1, color: C.chalk }}>
          Chi li misura?
        </div>
      </Appear>
      <Appear at={78} name="By eye" style={{ marginTop: 56 }}>
        <div style={{ fontFamily: SANS, fontSize: 48, lineHeight: 1.3, color: C.pouch }}>
          A occhio, nessuno.
        </div>
      </Appear>
    </AbsoluteFill>
  );
};
