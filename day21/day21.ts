import { Node, Grid, Point, PointS, toStr, shortestPath, fromStr } from "../shared/pathfinding";
import { concatMap, entries, filter, map, memoize, readInputLines, sumBy } from "../shared/utils";

type PadNode = Node & {
    path: string[],
};

const parsePad = (lines: string[]): Grid<string> => {
    const grid = new Map<PointS, string>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const curr = lines[y][x];
            if (curr !== ".") {
                grid.set(toStr([x, y]), curr);
            }
        }
    }

    return grid;
};

const dirs = {
    "^": [0, -1],
    "v": [0, 1],
    "<": [-1, 0],
    ">": [1, 0],
};

function* next({ pos: [x, y], path }: PadNode, pad: Grid<string>): Iterable<[PadNode, number]> {
    for (const [sym, [dx, dy]] of entries(dirs)) {
        const next = [x + dx, y + dy] as Point;
        if (!pad.has(toStr(next))) {
            continue;
        }

        yield [{ pos: next, path: [...path, sym]}, 1];
    }
}

const findAll = (
    { pos: [x, y], path }: PadNode,
    [ex, ey]: Point,
    pad: Grid<string>,
    cost: number,
    route: Set<string>,
    minCost: number,
    visited: Map<string, number>
): Iterable<string[]> => {
    if (x === ex && y === ey && cost === minCost) {
        return [path];
    }

    const last = path[path.length - 1];
    if (cost > minCost || cost > visited.get(`${x}_${y}_${last}`)!) {
        return [];
    }

    const ns = filter(next({ pos: [x, y], path }, pad), ([n]) => !route.has(`${toStr(n.pos)}-${n.path[n.path.length - 1]}`));
    return concatMap(ns, ([n, c]) => findAll(n, [ex, ey], pad, cost + c, new Set<string>([...route, `${toStr(n.pos)}-${n.path[n.path.length - 1]}`]), minCost, visited));
};

const mapPaths = (pad: Grid<string>): Map<string, string[][]> => {
    const paths = new Map<string, string[][]>();

    for (const a of pad.keys()) {
        for (const b of pad.keys()) {
            const [state, visited] = shortestPath<PadNode>(
                [[{ pos: fromStr(a), path: [] }, 0]],
                fromStr(b),
                node => toStr(node.pos),
                node => next(node, pad),
            )!;

            const all = findAll({ pos: fromStr(a), path: [] }, fromStr(b), pad, 0, new Set<string>(), state.cost, visited);
            paths.set(`${pad.get(a)}_${pad.get(b)}`, Array.from(map(all, p => [...p, 'A'])));
        }
    }

    return paths;
};

const numPaths = mapPaths(parsePad([
    "789",
    "456",
    "123",
    ".0A",
]));

const dirPaths = mapPaths(parsePad([
    ".^A",
    "<v>",
]));

function* paths(buttons: string[], pathMap: Map<string, string[][]>): Iterable<string[][]> {
    if (buttons.length === 1) {
        yield [];
        return;
    }

    const [a, b, ...rest] = buttons;
    yield* concatMap(
        pathMap.get(`${a}_${b}`)!,
        p1 => map(paths([b, ...rest], pathMap), p2 => [p1, ...p2]));
};

const minDirPath = memoize((buttons: string[], depth: number): number => {
    if (depth === 0) {
        return buttons.length;
    }

    return Math.min(...map(paths(['A', ...buttons], dirPaths), ps => sumBy(ps, p => minDirPath(p, depth - 1))));
}, (bs, d) => `${bs.join('')}_${d}`);

const complexity = (code: string, depth: number): number => {
    const ps = Array.from(paths(['A', ...code], numPaths));
    const len = Math.min(...map(ps, p => sumBy(p, x => minDirPath(x, depth))));
    return parseInt(code.slice(0, 3), 10) * len;
};

const day21 = (lines: string[]): [number, number] => {
    return [
        sumBy(lines, l => complexity(l, 2)),
        sumBy(lines, l => complexity(l, 25)),
    ];
};

(async () => {
    const input = await readInputLines('day21');
    const [part1, part2] = day21(input);

    console.log(part1);
    console.log(part2);
})();