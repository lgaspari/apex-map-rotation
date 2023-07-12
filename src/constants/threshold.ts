export enum Threshold {
  FIVE_MINUTES = 5,
  TEN_MINUTES = 10,
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  SIXTY_MINUTES = 60,
}

export const ThresholdLabel: Record<Threshold, string> = Object.freeze({
  [Threshold.FIVE_MINUTES]: '5 minutes',
  [Threshold.TEN_MINUTES]: '10 minutes',
  [Threshold.FIFTEEN_MINUTES]: '15 minutes',
  [Threshold.THIRTY_MINUTES]: '30 minutes',
  [Threshold.SIXTY_MINUTES]: '1 hour',
});
