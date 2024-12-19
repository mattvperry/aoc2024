import { mod, readInputLines } from "../shared/utils";

type State = {
    pc: number,
    tape: Bit[],
    a: number,
    b: number,
    c: number,
    out: number[],
};

type Operand = 'literal' | 'combo';
type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Op = typeof bitToOp[number];

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

const bitToOp = [
    'adv',
    'bxl',
    'bst',
    'jnz',
    'bxc',
    'out',
    'bdv',
    'cdv',
];

const run: Record<Op, (state: State) => State> = {
    adv: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        a: Math.floor(state.a / Math.pow(2, operand(state, 'combo'))),
    }),
    bxl: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        b: state.b ^ operand(state, 'literal'),
    }),
    bst: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        b: mod(operand(state, 'combo'), 8),
    }),
    jnz: (state: State): State => ({
        ...state,
        pc: state.a === 0 ? state.pc + 2 : operand(state, 'literal'),
    }),
    bxc: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        b: state.b ^ state.c,
    }),
    out: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        out: [...state.out, mod(operand(state, 'combo'), 8)]
    }),
    bdv: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        b: Math.floor(state.a / Math.pow(2, operand(state, 'combo'))),
    }),
    cdv: (state: State): State => ({
        ...state,
        pc: state.pc + 2,
        c: Math.floor(state.a / Math.pow(2, operand(state, 'combo'))),
    }),
};

const operand = ({ pc, tape, a, b, c }: State, type: Operand): number => {
    const bit = tape[pc + 1];
    if (type === 'literal') {
        return bit;
    } else {
        return {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: a,
            5: b,
            6: c,
            7: -Infinity,
        }[bit];
    }
};

const exec = (state: State): State => {
    while (state.pc <= state.tape.length - 2) {
        const bit = state.tape[state.pc];
        const op = run[bitToOp[bit]];
        state = op(state);
    }

    return state;
};

const day17 = (lines: string[]): [string, number] => {
    const state = parseProgram(lines);
    const final = exec(state);

    return [
        final.out.join(','),
        0
    ];
};

(async () => {
    const input = await readInputLines('day17');
    const [part1, part2] = day17(input);

    console.log(part1);
    console.log(part2);
})();