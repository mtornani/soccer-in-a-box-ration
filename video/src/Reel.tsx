import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Close } from "./scenes/Close";
import { Field } from "./scenes/Field";
import { Hook } from "./scenes/Hook";
import { Question } from "./scenes/Question";
import { Ration } from "./scenes/Ration";
import { Together } from "./scenes/Together";

export const SCENES = [
  { id: "Hook", component: Hook, durationInFrames: 165 },
  { id: "Ration", component: Ration, durationInFrames: 190 },
  { id: "Field", component: Field, durationInFrames: 290 },
  { id: "Question", component: Question, durationInFrames: 140 },
  { id: "Together", component: Together, durationInFrames: 270 },
  { id: "Close", component: Close, durationInFrames: 230 },
];

const T = 12; // cross-fade length in frames
export const REEL_DURATION =
  SCENES.reduce((s, sc) => s + sc.durationInFrames, 0) - T * (SCENES.length - 1);

export const Reel: React.FC = () => (
  <TransitionSeries>
    {SCENES.flatMap(({ id, component: Scene, durationInFrames }, i) => [
      ...(i > 0
        ? [<TransitionSeries.Transition key={`t-${id}`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />]
        : []),
      <TransitionSeries.Sequence key={id} name={id} durationInFrames={durationInFrames}>
        <Scene />
      </TransitionSeries.Sequence>,
    ])}
  </TransitionSeries>
);
