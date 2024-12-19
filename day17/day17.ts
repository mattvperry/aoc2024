import { mod, readInputLines  } from "../shared/utils";

type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type State = {
    pc: number,
    tape: Bit[],
    a: number,
    b: number,
    c: number,
    out: number[],
};

const parseProgram = (lines: string[]): State => {
    const [a, b, c, _, o] = lines;

    return {
        pc: 0,
        out: [],
        a: parseInt(a.split(': ')[1], 10),
        b: parseInt(b.split(': ')[1], 10),
        c: parseInt(c.split(': ')[1], 10),
        tape: o.split(': ')[1].split(',').map(x => parseInt(x, 10)) as Bit[],
    };
};

function* run(a: number): Iterable<Bit> {
    while (a !== 0) {
        const temp = (a % 8) ^ 1;
        yield mod((temp ^ Math.floor(a / Math.pow(2, temp))) ^ 6, 8) as Bit;
        a = Math.floor(a / 8);
    }
}

function* quine(tape: Bit[]): Iterable<number> {
    const toVisit: [number, number][] = [[0, tape.length - 1]];
    while (toVisit.length !== 0) {
        const [a, i] = toVisit.pop()!;
        if (i === -1) {
            yield a;
        }

        const tail = tape.slice(i).join('');
        for (let j = 0; j < 8; ++j) {
            const next = (8 * a) + j;
            if (Array.from(run(next)).join('') === tail) {
                toVisit.push([next, i - 1]);
            }
        }
    }
};

const day17 = (lines: string[]): [string, number] => {
    const state = parseProgram(lines);

    return [
        Array.from(run(state.a)).join(','),
        Math.min(...quine(state.tape)),
    ];
};

(async () => {
    const input = await readInputLines('day17');
    const [part1, part2] = day17(input);

    console.log(part1);
    console.log(part2);
})();