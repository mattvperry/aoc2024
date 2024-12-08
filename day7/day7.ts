import { sumBy, readInputLines, partition } from '../shared/utils';

const parseLine = (line: string): [number, number[]] => {
    const [target, rest] = line.split(': ');
    const xs = rest.split(' ');
    return [parseInt(target, 10), xs.map(x => parseInt(x, 10))];
};

const valid = (target: number, curr: number, xs: number[], part2: boolean): boolean => {
    if (target === curr && xs.length === 0) {
        return true;
    } else if (xs.length === 0) {
        return false;
    }

    const [x, ...rest] = xs;
    return valid(target, curr + x, rest, part2) 
        || valid(target, curr * x, rest, part2) 
        || (part2 ? valid(target, parseInt(`${curr}${x}`, 10), rest, part2) : false);
};

const day7 = (lines: string[]): [number, number] => {
    const eqs = lines.map(parseLine);
    const [p1, rest] = partition(eqs, ([t, [x, ...xs]]) => valid(t, x, xs, false));
    return [
        sumBy(p1, ([t]) => t),
        sumBy(rest.filter(([t, [x, ...xs]]) => valid(t, x, xs, true)), ([t]) => t),
    ]
};

(async () => {
    const input = await readInputLines('day7');
    const [part1, part2] = day7(input);

    console.log(part1);
    console.log(part1 + part2);
})();