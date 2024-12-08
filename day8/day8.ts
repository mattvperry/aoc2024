import { Point, toStr } from '../shared/pathfinding';
import { concatMap, distinct, map, readInputLines } from '../shared/utils';

type Map = {
    antennae: Point[][],
    bounds: [number, number],
};

const parseInput = (lines: string[]): Map => {
    const antennae: Record<string, Point[]> = {};
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            const curr = lines[y][x];
            if (curr === '.') {
                continue;
            }

            antennae[curr] = [...(antennae[curr] ?? []), [x, y]];
        }
    }

    return { 
        antennae: Object.values(antennae),
        bounds: [lines[0].length, lines.length]
    };
};

const inBounds = ([x, y]: Point, [maxX, maxY]: Map['bounds']): boolean => {
    return x >= 0 && x < maxX && y >= 0 && y < maxY;
};

function* antinodes(points: Point[], bounds: Map['bounds'], part2: boolean): Iterable<Point> {
    if (points.length <= 1) {
        return;
    }

    for (const [x1, y1] of points) {
        for (const [x2, y2] of points) {
            const [dx, dy] = [x2 - x1, y2 - y1];
            if (dx === 0 && dy === 0) {
                continue;
            }

            let i = part2 ? 0 : 1;
            do {
                const node = [x2 + (i * dx), y2 + (i * dy)] as Point;
                if (!inBounds(node, bounds)) {
                    break;
                }

                i++;
                yield node;
            } while (part2);
        }
    }
}

const day8 = (lines: string[]): [number, number] => {
    const { antennae, bounds } = parseInput(lines);
    return [
        distinct(map(concatMap(antennae, ps => antinodes(ps, bounds, false)), toStr)).length,
        distinct(map(concatMap(antennae, ps => antinodes(ps, bounds, true)), toStr)).length,
    ]
};

(async () => {
    const input = await readInputLines('day8');
    const [part1, part2] = day8(input);

    console.log(part1);
    console.log(part2);
})();