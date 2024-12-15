import { frequency, isDefined, mod, readInputLines, reduce } from "../shared/utils";

type Robot = {
    start: [number, number],
    vel: [number, number],
}

const parseRobots = (lines: string[]): Robot[] => {
    return lines.map(l => {
        const [p, v] = l.split(' ');
        const [x, y] = p.slice(2).split(',').map(x => parseInt(x, 10));
        const [dx, dy] = v.slice(2).split(',').map(x => parseInt(x, 10));

        return {
            start: [x, y],
            vel: [dx, dy],
        }
    });
};

const extrapolate = (
    { start: [x, y], vel: [dx, dy] }: Robot,
    steps: number,
    [maxX, maxY]: [number, number]): [number, number] => {
    return [
        mod(x + steps * dx, maxX),
        mod(y + steps * dy, maxY)
    ];
};

const quadrant = ([x, y]: [number, number], [maxX, maxY]: [number, number]): number | undefined => {
    const midX = Math.floor(maxX / 2);
    const midY = Math.floor(maxY / 2);

    if (x < midX && y < midY) {
        return 1;
    } else if (x < midX && y > midY) {
        return 2;
    } else if (x > midX && y < midY) {
        return 3;
    } else if (x > midX && y > midY) {
        return 4;
    }
};

const safetyFactor = (positions: [number, number][], bounds: [number, number]): number => {
    const freq = frequency(positions.map(p => quadrant(p, bounds)).filter(isDefined));
    return reduce(freq.values(), 1, (acc, curr) => acc * curr);
};

const day14 = (lines: string[]): [number, number] => {
    const bounds = [101, 103] as [number, number];
    const robots = parseRobots(lines);
    const frames = Array.from(
        { length: 11000 },
        (_, i) => safetyFactor(robots.map(r => extrapolate(r, i, bounds)), bounds));

    return [
        frames[100],
        frames.indexOf(Math.min(...frames)),
    ];
};

(async () => {
    const input = await readInputLines('day14');
    const [part1, part2] = day14(input);

    console.log(part1);
    console.log(part2);
})();