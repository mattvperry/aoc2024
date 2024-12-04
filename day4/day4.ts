import { sum, readInputLines, countBy } from '../shared/utils';
import { Grid, Point, PointS, toStr, fromStr } from '../shared/pathfinding';

const toNum = {
    'X': 0,
    'M': 1,
    'A': 2,
    'S': 3,
};

const dirs: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1]
];

const parseGrid = (lines: string[]): Grid => {
    const grid = new Map<PointS, number>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            grid.set(toStr([x, y]), toNum[lines[x][y] as keyof typeof toNum]);
        }
    }

    return grid;
};

const find = (grid: Grid, x: keyof typeof toNum): PointS[] => Array
    .from(grid.entries())
    .filter(([, n]) => n === toNum[x])
    .map(([p]) => p);

const countXmas = (point: PointS, grid: Grid): number => {
    let count = 0;
    const [x, y] = fromStr(point);
    for (const [dx, dy] of dirs) {
        let i = 1;
        for (; i < 4; ++i) {
            if (grid.get(toStr([x + (dx * i), y + (dy * i)])) !== i) {
                break;
            }
        }

        if (i === 4) {
            count += 1;
        }
    }

    return count;
};

const countMas = (point: PointS, grid: Grid): boolean => {
    const [x, y] = fromStr(point);
    const [a, b, c, d] = [[x - 1, y - 1], [x + 1, y + 1], [x - 1, y + 1], [x + 1, y - 1]] as [Point, Point, Point, Point];
    const start1 = grid.get(toStr(a));
    const end1 = grid.get(toStr(b));
    const start2 = grid.get(toStr(c));
    const end2 = grid.get(toStr(d));
    return ((start1 === 1 && end1 === 3) || (start1 === 3 && end1 === 1)) && ((start2 === 1 && end2 === 3) || (start2 === 3 && end2 === 1));
};

const day4 = (lines: string[]): [number, number] => {
    const grid = parseGrid(lines);
    return [
        sum(find(grid, 'X').map(p => countXmas(p, grid))),
        countBy(find(grid, 'A'), p => countMas(p, grid)),
    ];
};

(async () => {
    const input = await readInputLines('day4');
    const [part1, part2] = day4(input);

    console.log(part1);
    console.log(part2);
})();