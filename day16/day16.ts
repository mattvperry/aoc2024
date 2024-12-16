import { readInputLines } from "../shared/utils";

const day16 = (lines: string[]): [number, number] => {
    return [
        0,
        0,
    ];
};

(async () => {
    const input = await readInputLines('day16');
    const [part1, part2] = day16(input);

    console.log(part1);
    console.log(part2);
})();