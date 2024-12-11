import { fromStr, Grid, PointS, toStr } from '../shared/pathfinding';
import { filter, map, readInputLines, sumBy } from '../shared/utils';

const parseGrid = (lines: string[]): Grid => {
    const grid = new Map<PointS, number>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            grid.set(toStr([x, y]), parseInt(lines[y][x], 10));
        }
    }

    return grid;
};

const trailheads = (grid: Grid): Iterable<PointS> =>
    map(filter(grid.entries(), ([_, n]) => n === 0), ([p]) => p);

const neighbors = (p: PointS): PointS[] => {
    const [x, y] = fromStr(p);
    return [
        toStr([x + 1, y]),
        toStr([x - 1, y]),
        toStr([x, y + 1]),
        toStr([x, y - 1]),
    ];
};

const trails = (start: PointS, grid: Grid): PointS[] => {
    const curr = grid.get(start)!;
    if (curr === 9) {
        return [start];
    }

    return neighbors(start)
        .filter(p => grid.get(p) === curr + 1)
        .flatMap(p => trails(p, grid));
};

const day10 = (lines: string[]): [number, number] => {
    const grid = parseGrid(lines);
    const ts = [...map(trailheads(grid), p => trails(p, grid))];
    return [
        sumBy(ts, t => new Set<PointS>(t).size),
        sumBy(ts, t => t.length),
    ];
};

(async () => {
    const input = await readInputLines('day10');
    const [part1, part2] = day10(input);

    console.log(part1);
    console.log(part2);
})();