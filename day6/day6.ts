import { Point, PointS, Grid, toStr } from '../shared/pathfinding';
import { readInputLines, reduce } from '../shared/utils';

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

function* steps(grid: Grid<boolean>, [x, y]: Point, dir: number): Iterable<[Point, number]> {
    while (true) {
        yield [[x, y], dir];
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
};

const day6 = (lines: string[]): [number, number] => {
    const [grid, start] = parseGrid(lines);

    const seen = new Set<`${PointS}_${number}`>();
    const points = new Set<PointS>();
    const extraWalls = new Set<PointS>();
    for (const [[x, y], dir] of steps(grid, start, 0)) {
        const curr = toStr([x, y]);
        points.add(curr);
        seen.add(`${curr}_${dir}`);

        const [dx, dy] = dirs[dir];
        const facing = toStr([x + dx, y + dy]);
        if (grid.get(facing) === true || points.has(facing)) {
            continue;
        }

        const aseen = new Set<`${PointS}_${number}`>();
        const agrid = new Map<PointS, boolean>(grid.entries());
        agrid.set(facing, true);
        for (const [[ax, ay], adir] of steps(agrid, [x, y], (dir + 1) % 4)) {
            const [altDx, altDy] = dirs[adir];
            const acurr = toStr([ax, ay]);
            aseen.add(`${acurr}_${adir}`);

            const astate = `${toStr([ax + altDx, ay + altDy])}_${adir}` as const;
            if (seen.has(astate) || aseen.has(astate)) {
                extraWalls.add(facing);
                break;
            }
        }
    }

    extraWalls.delete(toStr(start));
    return [
        points.size,
        extraWalls.size,
    ]
};

(async () => {
    const input = await readInputLines('day6');
    const [part1, part2] = day6(input);

    console.log(part1);
    console.log(part2);
})();