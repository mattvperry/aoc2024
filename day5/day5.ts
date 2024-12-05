import { sumBy, splitOn, readInputLines, partition } from '../shared/utils';

type Rule = [number, number];
type Update = number[];

const parseRule = (line: string): Rule => line.split('|').map(x => parseInt(x, 10)) as Rule;
const parseUpdate = (line: string): Update => line.split(',').map(x => parseInt(x, 10));
const parseInput = (lines: string[]): [Rule[], Update[]] => {
    const [rs, us] = splitOn(lines, '')
    return [
        rs.map(parseRule),
        us.map(parseUpdate),
    ];
};

const isValid = (update: Update, rules: Rule[]): boolean => {
    const lookup = new Map<number, number>(update.map((n, i) => [n, i]));
    return rules.every(([a, b]) => {
        return (lookup.get(a) ?? -Infinity) < (lookup.get(b) ?? Infinity);
    });
};

const reorder = (update: Update, ruleSet: Set<string>): Update => {
    const lookupIdx = new Map<number, number>(update.map((n, i) => [n, i]));
    return update.toSorted((a, b) => {
        if (ruleSet.has(`${a}_${b}`)) {
            return -1;
        } else if (ruleSet.has(`${b}_${a}`)) {
            return 1;
        } else {
            return lookupIdx.get(a)! < lookupIdx.get(b)! ? -1 : 1;
        }
    });
};

const middle = (update: Update): number => update[Math.floor(update.length / 2)];

const day5 = (lines: string[]): [number, number] => {
    const [rules, updates] = parseInput(lines);
    const [valid, invalid] = partition(updates, u => isValid(u, rules));
    const ruleSet = new Set<string>(rules.map(([a, b]) => `${a}_${b}`));

    return [
        sumBy(valid, middle),
        sumBy(invalid, u => middle(reorder(u, ruleSet))),
    ];
};

(async () => {
    const input = await readInputLines('day5');
    const [part1, part2] = day5(input);

    console.log(part1);
    console.log(part2);
})();