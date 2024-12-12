import { fromStr, Grid, PointS, toStr } from "../shared/pathfinding";
import { sumBy, readInputLines, concatMap, filter, map, countBy, size } from "../shared/utils";

type Plot = Set<PointS>;

const parseGrid = (lines: string[]): Grid<string> => {
    const grid = new Map<PointS, string>();
    for (let y = 0; y < lines.length; ++y) {
        for (let x = 0; x < lines[0].length; ++x) {
            grid.set(toStr([x, y]), lines[y][x]);
        }
    }

    return grid;
};

const neighbors = (point: PointS, diag?: boolean): PointS[] => {
    const [x, y] = fromStr(point);
    return [
        toStr([x + 1, y]),
        toStr([x - 1, y]),
        toStr([x, y + 1]),
        toStr([x, y - 1]),
    ];
};

const plot = (start: PointS, grid: Grid<string>): Plot => {
    const type = grid.get(start)!;
    const toVisit = [start];
    const seen = new Set<PointS>();
    while (toVisit.length !== 0) {
        const curr = toVisit.pop()!;
        seen.add(curr);
        toVisit.push(...neighbors(curr).filter(p => grid.get(p) === type && !seen.has(p)));
    }

    return seen;
}

function* plots(grid: Grid<string>): Iterable<Plot> {
    let seen = new Set<PointS>();
    for (const key of grid.keys()) {
        if (seen.has(key)) {
            continue;
        }

        const p = plot(key, grid);
        seen = seen.union(p);
        yield p;
    }
};

const area = (plot: Plot): number => {
    return plot.size;
};

const perimeter = (plot: Plot): number => {
    return size(filter(concatMap(plot, neighbors), p => !plot.has(p)));
};

const corners = (point: PointS, grid: Grid<string>): number => {
    const type = grid.get(point)!;
    const [x, y] = fromStr(point);
    return countBy([[1, 1], [-1, -1], [-1, 1], [1, -1]], ([dx, dy]) => {
        const [a, b, c] = [
            grid.get(toStr([x + dx, y])),
            grid.get(toStr([x, y + dy])),
            grid.get(toStr([x + dx, y + dy])),
        ];

        return (a !== type && b !== type) || (a === type && b === type && c !== type);
    });
};

const sides = (plot: Plot, grid: Grid<string>): number => {
    return sumBy(plot, p => corners(p, grid));
};

const day12 = (lines: string[]): [number, number] => {
    const grid = parseGrid(lines);
    const ps = Array.from(plots(grid));
    return [
        sumBy(ps, p => area(p) * perimeter(p)),
        sumBy(ps, p => area(p) * sides(p, grid)),
    ];
};

(async () => {
    const input = await readInputLines('day12');
    const [part1, part2] = day12(input);

    console.log(part1);
    console.log(part2);
})();