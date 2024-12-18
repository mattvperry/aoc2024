import { Node, shortestPath, Point, PointS, toStr } from "../shared/pathfinding";
import { filter, map, mod, readInputLines, reduce } from "../shared/utils";

type Dir = 0 | 1 | 2 | 3;
type DirNode = Node & {
    dir: Dir,
};

const dirs: Point[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

const parseMap = (lines: string[]): [Set<PointS>, Point, Point] => {
    let start: Point = [0, 0];
    let end: Point = [0, 0];
    const walls = new Set<PointS>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const curr = lines[y][x];
            if (curr === '#') {
                walls.add(toStr([x, y]));
            }

            if (curr === 'S') {
                start = [x, y];
            }

            if (curr === 'E') {
                end = [x, y];
            }
        }
    }

    return [walls, start, end];
};

const next = ({ pos: [x, y], dir }: DirNode, walls: Set<PointS>): Iterable<[DirNode, number]> => {
    const nodes = [-1, 0, 1].map(dd => {
        const d = mod(dir + dd, dirs.length);
        const [dx, dy] = dirs[d];
        if (dd === 0) {
            return [
                { pos: [x + dx, y + dy], dir: d},
                1,
            ] as [DirNode, number];
        } else {
            return [
                { pos: [x, y], dir: d },
                1000,
            ] as [DirNode, number];
        }
    });

    return nodes.filter(([n]) => !walls.has(toStr(n.pos)));
}

const findAll = (
    { pos: [x, y], dir }: DirNode,
    [ex, ey]: Point,
    walls: Set<PointS>,
    cost: number,
    path: Set<string>,
    minCost: number,
    visited: Map<string, number>
): Set<string> => {
    if (x === ex && y === ey && cost === minCost) {
        return path;
    }

    if (cost > minCost || cost > visited.get(`${x}_${y}_${dir}`)!) {
        return new Set<string>();
    }

    const ns = filter(next({ pos: [x, y], dir }, walls), ([n]) => !path.has(`${toStr(n.pos)}-${n.dir}`));
    return reduce(
        map(ns, ([n, c]) => findAll(n, [ex, ey], walls, cost + c, new Set<string>([...path, `${toStr(n.pos)}-${n.dir}`]), minCost, visited)),
        new Set<string>(),
        (acc, curr) => acc.union(curr));
};

const day16 = (lines: string[]): [number, number] => {
    const [walls, start, end] = parseMap(lines);
    const [state, visited] = shortestPath<DirNode>(
        [[{ pos: start, dir: 1 }, 0]],
        end,
        ({ pos: [x, y], dir }) => `${x}_${y}_${dir}`,
        node => next(node, walls),
    )!;

    const all = findAll({ pos: start, dir: 1 }, end, walls, 0, new Set<PointS>(), state.cost, visited);
    return [
        state.cost,
        new Set<string>(map(all, s => s.split('-')[0])).size,
    ];
};

(async () => {
    const input = await readInputLines('day16');
    const [part1, part2] = day16(input);

    console.log(part1);
    console.log(part2);
})();