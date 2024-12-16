import { fromStr, Grid, Point, PointS, toStr } from "../shared/pathfinding";
import { isDefined, readInputLines, splitOn, sumBy } from "../shared/utils";

type Item = '#' | 'O' | '[' | ']';
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
            if (curr === '#' || curr === 'O' || curr === '[' || curr === ']') {
                grid.set(toStr([x, y]), curr);
            } else if (curr === '@') {
                start = [x, y];
            }
        }
    }

    return [grid, start];
};

const transform = (lines: string[]): string[] => {
    return lines.map(l => l
        .replaceAll("#", "##")
        .replaceAll("O", "[]")
        .replaceAll(".", "..")
        .replaceAll("@", "@.")
    );
};

const dirs: Record<Dir, Point> = {
    'v': [0, 1],
    '>': [1, 0],
    '<': [-1, 0],
    '^': [0, -1],
};

function* contiguous(grid: Grid<Item>, [x, y]: Point, dir: Dir): Iterable<[Point, Item | undefined]> {
    const [dx, dy] = dirs[dir];
    const toVisit: Point[] = [[x + dx, y + dy]];
    const seen = new Set<PointS>();
    while (toVisit.length !== 0) {
        [x, y] = toVisit.pop()!;
        const currS = toStr([x, y]);
        if (seen.has(currS)) {
            continue;
        }

        seen.add(toStr([x, y]));
        const item = grid.get(currS);
        yield [[x, y], item];
        if (item === ']') {
            toVisit.push(...[[x + dx, y + dy] as Point, [x - 1, y] as Point])
        } else if (item === '[') {
            toVisit.push(...[[x + dx, y + dy] as Point, [x + 1, y] as Point])
        } else if (item === 'O') {
            toVisit.push([x + dx, y + dy]);
        }
    }
}

const move = (grid: Grid<Item>, [x, y]: Point, dir: Dir): Point => {
    const block = Array.from(contiguous(grid, [x, y], dir));
    if (block.some(([,i]) => i === '#')) {
        return [x, y];
    }

    for (const [[ix, iy]] of block.filter(([,i]) => isDefined(i))) {
        grid.delete(toStr([ix, iy]));
    }

    const [dx, dy] = dirs[dir];
    for (const [[ix, iy], item] of block.filter(([,i]) => isDefined(i))) {
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

const day15 = (lines: string[]): number => {
    const [grid, start, ds] = parseInput(lines);
    exec(grid, start, ds);
    return sumBy(grid.entries(), ([k, v]) => v === '#' || v === ']' ? 0 : coord(fromStr(k)));
};

(async () => {
    const input = await readInputLines('day15');
    const part1 = day15(input);
    const part2 = day15(transform(input));

    console.log(part1);
    console.log(part2);
})();