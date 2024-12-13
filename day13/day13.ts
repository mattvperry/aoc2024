import { readInputLines, splitOnEvery, sumBy } from "../shared/utils";

type Game = {
    id: number,
    a: [number, number],
    b: [number, number],
    target: [number, number],
};

const parseGames = (lines: string[]): Game[] => {
    return Array.from(splitOnEvery(lines, '')).map(parseGame);
};

const parseGame = (lines: string[], id: number): Game => {
    const [a, b, t] = lines;
    return {
        id,
        a: a.split(': ')[1].split(', ').map(x => parseInt(x.slice(2), 10)) as Game['a'],
        b: b.split(': ')[1].split(', ').map(x => parseInt(x.slice(2), 10)) as Game['b'],
        target: t.split(': ')[1].split(', ').map(x => parseInt(x.slice(2), 10)) as Game['target'],
    };
};

const valid = ([a, b]: [number, number]) => {
    return a % 1 === 0 && b % 1 === 0;
};

const solve = ({ a: [ax, ay], b: [bx, by], target: [tx, ty] }: Game): [number, number] => {
    const b = (ax * ty - ay * tx) / (ax * by - ay * bx);
    const a = (tx - bx * b) / ax;
    return [a, b];
};

const transform = (game: Game): Game => {
    return {
        ...game,
        target: game.target.map(t => t + 10000000000000) as Game['target'],
    }
};

const day13 = (lines: string[]): [number, number] => {
    const games = parseGames(lines);

    return [
        sumBy(games.map(solve).filter(valid), ([a, b]) => a * 3 + b),
        sumBy(games.map(transform).map(solve).filter(valid), ([a, b]) => a * 3 + b),
    ];
};

(async () => {
    const input = await readInputLines('day13');
    const [part1, part2] = day13(input);

    console.log(part1);
    console.log(part2);
})();