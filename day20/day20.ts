import { State, Node, Point, PointS, shortestPath, toStr } from "../shared/pathfinding";
import { filter, readInputLines, size } from "../shared/utils";

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

const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];

function* next({ pos: [x, y] }: Node, walls: Set<PointS>): Iterable<[Node, number]> {
    for (const [dx, dy] of dirs) {
        const [cx, cy] = [x + dx, y + dy];
        if (!walls.has(toStr([cx, cy]))) {
            yield [{ pos: [cx, cy] }, 1];
        }
    }
}

const getPath = (state: State<Node>): Point[] => {
    let curr = state;
    const rev: Point[] = [];
    while (true) {
        rev.push(curr.node.pos);
        if (curr.prev === null) {
            break;
        }

        curr = curr.prev;
    }

    return rev.toReversed();
};

const dist = ([ax, ay]: Point, [bx, by]: Point): number => {
    return Math.abs(ax - bx) + Math.abs(ay - by);
};

function* cheats(path: Point[], max: number): Iterable<number> {
    for (const [[x, y], i] of path.map((x, i) => [x, i] as const)) {
        for (const [[x2, y2], i2] of path.slice(i + 1).map((x, n) => [x, i + n + 1] as const)) {
            const d = dist([x, y], [x2, y2]);
            const save = i2 - i - d;
            if (d <= max && save > 0) {
                yield save;
            }
        }
    }
}

const day20 = (lines: string[]): [number, number] => {
    const [walls, start, end] = parseMap(lines);
    const [state] = shortestPath(
        [[{ pos: start }, 0]],
        end,
        node => toStr(node.pos),
        node => next(node, walls),
    )!;

    return [
        size(filter(cheats(getPath(state), 2), x => x >= 100)),
        size(filter(cheats(getPath(state), 20), x => x >= 100)),
    ];
};

(async () => {
    const input = await readInputLines('day20');
    const [part1, part2] = day20(input);

    console.log(part1);
    console.log(part2);
})();