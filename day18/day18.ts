import { readInputLines  } from "../shared/utils";

const day18 = (lines: string[]): [number, number] => {
    return [
        0,
        0,
    ];
};

(async () => {
    const input = await readInputLines('day18');
    const [part1, part2] = day18(input);

    console.log(part1);
    console.log(part2);
})();