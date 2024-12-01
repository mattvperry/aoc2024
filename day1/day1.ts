import { frequency, sum, zip, readInputLines } from '../shared/utils';

const parsePair = (line: string): [number, number] => {
    const [left, right] = line.split('   ');
    return [parseInt(left, 10), parseInt(right, 10)];
};

const day1 = (lines: string[]): [number, number] => {
    const pairs = lines.map(parsePair);
    const [left, right] = pairs.reduce((acc, curr) => [[...acc[0], curr[0]], [...acc[1], curr[1]]], [[], []] as [number[], number[]]);

    const lookup = frequency(right);
    return [
        sum(zip(left.toSorted(), right.toSorted()).map(([l, r]) => Math.abs(l - r))),
        sum(left.map(x => x * (lookup[x] ?? 0))),
    ];
};

(async () => {
    const input = await readInputLines('day1');
    const [part1, part2] = day1(input);

    console.log(part1);
    console.log(part2);
})();