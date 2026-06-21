export type FailClosedEnvelope = {
  mutated?: boolean;
  noClientRelease?: boolean;
  ok?: boolean;
  releaseUnlocked?: boolean;
  sufficiency?: boolean;
};

export function isFailClosedEnvelope(envelope: FailClosedEnvelope) {
  return (
    envelope.ok === false ||
    envelope.mutated === false ||
    envelope.noClientRelease === true ||
    envelope.releaseUnlocked === false ||
    envelope.sufficiency === false
  );
}

