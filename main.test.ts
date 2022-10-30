import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { GapRange, getGaps } from "./main.ts";

type TimeRange = `${string};${string}`;

const testEntries: [TimeRange[], GapRange<string>[]][] = [
  [[], []],
  [["2020-02-02;2020-03-02"], []],
  [
    [
      "2020-02-02;2020-03-02",
      "2019-04-02;2020-02-02",
    ],
    [],
  ],
  [
    [
      "2020-02-02;2020-03-02",
      "2019-04-02;2020-01-02",
    ],
    [{ start: "2020-01-02", end: "2020-02-02" }],
  ],
  [
    [
      "2020-02-02;2020-03-02",
      "2019-04-02;2019-07-01",
      "2019-01-01;2019-01-02",
    ],
    [
      { start: "2019-07-01", end: "2020-02-02" },
      { start: "2019-01-02", end: "2019-04-02" },
    ],
  ],
  [
    [
      "2020-02-02;2020-03-02",
      "2019-04-02;2020-02-02",
      "2019-01-01;2019-01-02",
    ],
    [{ start: "2019-01-02", end: "2019-04-02" }],
  ],
];

for (const [input, expectedPeriods] of testEntries) {
  Deno.test(
    `should work as expected ${JSON.stringify({ input, expectedPeriods })}`,
    () => {
      assertEquals(
        getGaps(
          input,
          (item) => {
            const [start, end] = item.split(";");
            return ({ start, end });
          },
          (c1, c2) => c1.localeCompare(c2),
        ),
        expectedPeriods,
      );
    },
  );
}
