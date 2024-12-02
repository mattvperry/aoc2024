import { countBy, distinct, map, readInputLines, zip } from '../shared/utils';

const parseReport = (line: string): number[] => {
    return line.split(' ').map(x => parseInt(x, 10));
};

const pairs = (xs: number[]): [number, number][] => {
    return zip(xs, xs.slice(1));
};

const problems = (report: number[]): number[] => {
    const data = pairs(report).map(([a, b], i) => [a - b, i] as const);
    const firstDir = data[0][0] < 0;
    return data
        .filter(([diff, _]) => (diff < 0 !== firstDir) || Math.abs(diff) < 1 || Math.abs(diff) > 3)
        .map(([_, idx]) => idx);
};

const safe = (report: number[]): boolean => {
    return problems(report).length === 0;
};

const safe2 = (report: number[]): boolean => {
    const ps = problems(report);
    if (ps.length === 0)
    {
        return true;
    }

    const idx = ps[0];
    const possible = distinct([Math.max(idx - 1, 0), idx, idx + 1, Math.min(idx + 2, report.length - 1)]);
    const attempts = possible.map(i => problems([...report.slice(0, i), ...report.slice(i + 1)]));
    return attempts.some(a => a.length === 0);
};

const day2 = (lines: string[]): [number, number] => {
    const reports = lines.map(parseReport);
    return [
        countBy(reports, safe),
        countBy(reports, safe2),
    ];
};

(async () => {
    const input = await readInputLines('day2');
    const [part1, part2] = day2(input);

    console.log(part1);
    console.log(part2);
})();