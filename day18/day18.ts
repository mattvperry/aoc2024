import { Node, Point, PointS, shortestPath, toStr } from "../shared/pathfinding";
import { readInputLines, splitAt  } from "../shared/utils";

const fell = 1024;
const size = 70;

const parsePoints = (lines: string[]): Point[] => {
    return lines.map(l => l.split(',').map(x => parseInt(x, 10)) as Point);
};

const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];

function* neighbors([x, y]: Point, walls: Set<PointS>): Iterable<[Node, number]> {
    for (const [dx, dy] of dirs) {
        const [cx, cy] = [x + dx, y + dy];
        if (!walls.has(toStr([cx, cy])) && cx >= 0 && cy >= 0 && cx <= size && cy <= size) {
            yield [{ pos: [cx, cy] }, 1];
        }
    }
}

const part1 = (fallen: Point[]): number => {
    const walls = new Set<PointS>(fallen.map(toStr));
    const [{ cost }] = shortestPath(
        [[{ pos: [0, 0] }, 0]],
        [size, size],
        ({ pos }) => toStr(pos),
        ({ pos }) => neighbors(pos, walls))!;
    return cost;
};

const part2 = (fallen: Point[], rest: Point[]): string => {
    const walls = new Set<PointS>(fallen.map(toStr));
    for (const x of rest) {
        walls.add(toStr(x));
        const state = shortestPath(
            [[{ pos: [0, 0] }, 0]],
            [size, size],
            ({ pos }) => toStr(pos),
            ({ pos }) => neighbors(pos, walls));

        if (state === undefined) {
            return toStr(x).replace('_', ',');
        }
    }

    return "unknown";
};

const day18 = (lines: string[]): [number, string] => {
    const points = parsePoints(lines);
    const [fallen, rest] = splitAt(points, fell);

    return [
        part1(fallen),
        part2(fallen, rest),
    ];
};

(async () => {
    const input = await readInputLines('day18');
    const [part1, part2] = day18(input);

    console.log(part1);
    console.log(part2);
})();