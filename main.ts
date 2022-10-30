type ObjectGapRange<T> = { start: T; end: T };

export type GapRange<T> = ObjectGapRange<T>;

export function getGaps<T, C>(
  entries: T[],
  asRange: (i: T) => GapRange<C>,
  compare: (c1: C, c2: C) => number,
): GapRange<C>[] {
  if (entries.length <= 1) return [];

  type GapRangeWithEndOnly = Pick<GapRange<C>, "end">;
  type LastWithEndOnly = [...GapRange<C>[], GapRangeWithEndOnly];
  const gapsWithExtra = entries.reduce((gaps, cur): LastWithEndOnly => {
    const lastGap = gaps[gaps.length - 1];

    const currentRange = asRange(cur);
    const gapFill: GapRangeWithEndOnly = { end: currentRange.start };

    if (typeof lastGap?.end === "undefined") {
      return [gapFill];
    }

    if (compare(currentRange.end, lastGap.end) === 0) {
      return [...withoutLast(gaps), gapFill];
    }

    return [
      ...withoutLast(gaps),
      { ...lastGap, start: currentRange.end },
      gapFill,
    ];
  }, [] as GapRange<C>[] | LastWithEndOnly);

  return withoutLast(gapsWithExtra);
}

const withoutLast = <T extends unknown[]>(array: T): ArrayHead<T> =>
  array.slice(0, -1) as ArrayHead<T>;

type ArrayHead<T extends unknown[]> = T extends [...infer H, infer L] ? H : T;
