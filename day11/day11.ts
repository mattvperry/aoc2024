import { memoize, readInputLines, splitAt, sumBy } from '../shared/utils';

const parseStones = (line: string): number[] => {
    return line.split(' ').map(x => parseInt(x, 10));
};

const change = (stone: number): number[] => {
    const digits = stone.toString();
    if (digits.length % 2 === 0) {
        return splitAt(digits, digits.length / 2).map(x => parseInt(x, 10));
    } else if (stone === 0) {
        return [1];
    } else {
        return [stone * 2024];
    }
};

const blink = memoize((stone: number, times: number): number => {
    if (times === 0) {
        return 1;
    }

    return sumBy(change(stone), s => blink(s, times - 1));
}, (s, t) => `${s}_${t}`);

const day11 = ([line]: string[]): [number, number] => {
    const stones = parseStones(line);

    return [
        sumBy(stones, s => blink(s, 25)),
        sumBy(stones, s => blink(s, 75)),
    ];
};

(async () => {
    const input = await readInputLines('day11');
    const [part1, part2] = day11(input);

    console.log(part1);
    console.log(part2);
})();