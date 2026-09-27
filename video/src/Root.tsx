import "./index.css";
import { Composition, Folder } from "remotion";
import { Reel, REEL_DURATION, SCENES } from "./Reel";

const size = { width: 1080, height: 1920, fps: 30 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={REEL_DURATION} {...size} />
    <Folder name="Reel-Scenes">
      {SCENES.map(s => (
        <Composition key={s.id} id={s.id} component={s.component} durationInFrames={s.durationInFrames} {...size} />
      ))}
    </Folder>
  </>
);
