import { fromStr, Grid, Point, PointS, toStr } from "../shared/pathfinding";
import { readInputLines, splitOn, sumBy } from "../shared/utils";

type Item = '#' | 'O';
type Dir = 'v' | '>' | '<' | '^';

const parseInput = (lines: string[]): [Grid<Item>, Point, Dir[]] => {
    const [g, d] = splitOn(lines, '');
    return [...parseGrid(g), parseDirs(d)];
};

const parseDirs = (lines: string[]): Dir[] => {
    return lines.join('').split('') as Dir[];
};

const parseGrid = (lines: string[]): [Grid<Item>, Point] => {
    let start: Point = [0, 0];
    const grid = new Map<PointS, Item>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const curr = lines[y][x];
            if (curr === '#' || curr === 'O') {
                grid.set(toStr([x, y]), curr);
            } else if (curr === '@') {
                start = [x, y];
            }
        }
    }

    return [grid, start];
};

const dirs: Record<Dir, Point> = {
    'v': [0, 1],
    '>': [1, 0],
    '<': [-1, 0],
    '^': [0, -1],
};

function* contiguous(grid: Grid<Item>, [x, y]: Point, dir: Dir): Iterable<[Point, Item | undefined]> {
    const [dx, dy] = dirs[dir];
    while (true) {
        [x, y] = [x + dx, y + dy];
        const item = grid.get(toStr([x, y]));
        yield [[x, y], item];
        if (item === undefined || item === '#') {
            break;
        }
    }
}

const move = (grid: Grid<Item>, [x, y]: Point, dir: Dir): Point => {
    const [[_, head], ...rest] = Array.from(contiguous(grid, [x, y], dir)).toReversed();
    if (head === '#') {
        return [x, y];
    }

    const [dx, dy] = dirs[dir];
    for (const [[ix, iy], item] of rest) {
        grid.delete(toStr([ix, iy]));
        grid.set(toStr([ix + dx, iy + dy]), item!);
    }

    return [x + dx, y + dy];
};

const exec = (grid: Grid<Item>, pos: Point, ds: Dir[]): Point => {
    for (const dir of ds) {
        pos = move(grid, pos, dir);
    }

    return pos;
};

const coord = ([x, y]: Point): number => {
    return y * 100 + x;
};

const day15 = (lines: string[]): [number, number] => {
    const [grid, start, ds] = parseInput(lines);
    const final = exec(grid, start, ds);

    return [
        sumBy(grid.entries(), ([k, v]) => v === 'O' ? coord(fromStr(k)) : 0),
        0,
    ];
};

(async () => {
    const input = await readInputLines('day15');
    const [part1, part2] = day15(input);

    console.log(part1);
    console.log(part2);
})();