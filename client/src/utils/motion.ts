/** `data-reveal` value for the i-th card in a row: 1–4, so cards cascade in. */
export const revealOrder = (index: number): string => String((index % 4) + 1);
