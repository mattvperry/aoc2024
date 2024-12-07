import { Point, PointS, Grid, toStr } from '../shared/pathfinding';
import { readInputLines } from '../shared/utils';

const dirs: [number, number][] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

const parseGrid = (lines: string[]): [Grid<boolean>, Point] => {
    let [sx, sy] = [-1, -1];
    const grid = new Map<PointS, boolean>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const curr = lines[y][x];
            grid.set(toStr([x, y]), curr === '#');
            if (curr === '^') {
                [sx, sy] = [x, y];
            }
        }
    }

    return [grid, [sx, sy]];
};

const steps = (grid: Grid<boolean>, [x, y]: Point, dir: number): Set<PointS> => {
    const set = new Set<PointS>();
    while (true) {
        set.add(toStr([x, y]));
        const [dx, dy] = dirs[dir];
        const [nx, ny] = [x + dx, y + dy];
        const cell = grid.get(toStr([nx, ny]));
        if (cell === undefined) {
            break;
        } else if (cell) {
            dir = (dir + 1) % 4;
        } else {
            [x, y] = [nx, ny];
        }
    }

    return set;
};

const day6 = (lines: string[]): [number, number] => {
    const [grid, start] = parseGrid(lines);

    return [
        steps(grid, start, 0).size,
        0,
    ];
};

(async () => {
    const input = await readInputLines('day6');
    const [part1, part2] = day6(input);

    console.log(part1);
    console.log(part2);
})();