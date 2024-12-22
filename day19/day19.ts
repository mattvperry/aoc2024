import { countBy, memoize, readInputLines, splitOn, sum, sumBy } from "../shared/utils";

const parseTowels = (lines: string[]): [string[], string[]] => {
    const [[towels], patterns] = splitOn(lines, '');
    return [towels.split(', '), patterns];
};

const possible = memoize((pattern: string, towels: string[]): number => {
    if (pattern === '') {
        return 1;
    }

    const potential = towels.filter(t => pattern.startsWith(t));
    return sumBy(potential, t => possible(pattern.slice(t.length), towels))
}, (p, _) => p);

const day19 = (lines: string[]): [number, number] => {
    const [towels, patterns] = parseTowels(lines);
    const ways = patterns.map(p => possible(p, towels));

    return [
        countBy(ways, w => w !== 0),
        sum(ways),
    ];
};

(async () => {
    const input = await readInputLines('day19');
    const [part1, part2] = day19(input);

    console.log(part1);
    console.log(part2);
})();