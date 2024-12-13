import { readInputLines, splitOnEvery, sum } from "../shared/utils";

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

const isWinner = (
    [a, b]: [number, number],
    { a: [ax, ay], b: [bx, by], target: [tx, ty] }: Game): boolean => {
    return (a * ax + b * bx === tx) && (a * ay + b * by === ty);
};

const cost = ([a, b]: [number, number]): number => {
    return a * 3 + b;
};

function* pushes(): Iterable<[number, number]> {
    for (let a = 1; a <= 100; ++a) {
        for (let b = 1; b <= 100; ++b) {
            yield [a, b];
        }
    }
};

const part1 = (games: Game[]): number => {
    const mins = new Map<number, number>();
    for (const push of pushes()) {
        for (const game of games) {
            if (!isWinner(push, game)) {
                continue;
            }

            const curr = cost(push);
            if (curr < (mins.get(game.id) ?? Infinity)) {
                mins.set(game.id, curr);
            }
        }
    }

    return sum(mins.values());
};

const day13 = (lines: string[]): [number, number] => {
    const games = parseGames(lines);

    return [
        part1(games),
        0
    ];
};

(async () => {
    const input = await readInputLines('day13');
    const [part1, part2] = day13(input);

    console.log(part1);
    console.log(part2);
})();