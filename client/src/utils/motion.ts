import { REVEAL_STEPS } from "../constants/ui";
/** `data-reveal` value for the i-th card in a row: 1–REVEAL_STEPS, so cards cascade in. */
export const revealOrder = (index: number): string =>
  String((index % REVEAL_STEPS) + 1);
