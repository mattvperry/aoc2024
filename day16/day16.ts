import { Node, shortestPath, Point, PointS, toStr } from "../shared/pathfinding";
import { mod, readInputLines } from "../shared/utils";

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
        return [
            { pos: [x + dx, y + dy], dir: d },
            dd === 0 ? 1 : 1001
        ] as [DirNode, number];
    });

    return nodes.filter(([n]) => !walls.has(toStr(n.pos)));
}

const day16 = (lines: string[]): [number, number] => {
    const [walls, start, end] = parseMap(lines);
    const last = shortestPath<DirNode>(
        [[{ pos: start, dir: 1 }, 0]],
        end,
        ({ pos: [x, y], dir }) => `${x}_${y}_${dir}`,
        node => next(node, walls),
    );

    return [
        last?.cost ?? -1,
        0,
    ];
};

(async () => {
    const input = await readInputLines('day16');
    const [part1, part2] = day16(input);

    console.log(part1);
    console.log(part2);
})();