import { readInputLines } from "../shared/utils";

type State = {
    pc: number,
    a: number,
    b: number,
    c: number,
    out: number[],
};

type Operand = 'literal' | 'combo';
type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Op = {
    name: typeof ops[number]['name'],
    operandType: Operand,
    operand: Bit,
    exec: (state: State, operand: number) => State,
};

const ops = [
    { name: 'adv', operand: 'combo', exec: (state: State, operand: number) => ({
        ...state,
        pc: state.pc + 1,
        a: Math.floor(state.a / Math.pow(operand, 2)),
    }) },
    { name: 'bxl', operand: 'literal', exec: (state: State, operand: number) => ({
        ...state,
        pc: state.pc + 1,
        b: state.b ^ operand,
    }) },
    { name: 'bst', operand: 'combo', exec: (state: State, operand: number) => ({
        ...state,
        b: operand % 8,
    }) },
    { name: 'jnz', operand: 'literal', exec: (state: State, operand: number) => ({

    }) },
    { name: 'bxc', operand: 'literal', exec: (state: State, _: number) => {

    } },
    { name: 'out', operand: 'combo', exec: (state: State, operand: number) => {

    } },
    { name: 'bdv', operand: 'combo', exec: (state: State, operand: number) => {

    } },
    { name: 'cdv', operand: 'combo', exec: (state: State, operand: number) => {

    } },
] as const;

const parseProgram = (lines: string[]): [State, Op[]] => {
};

const readOperand = (state: State, op: Op): number => {
    if (op.operandType === 'literal') {
        return op.operand;
    } else {
        return {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: state.a,
            5: state.b,
            6: state.c,
            7: -Infinity,
        }[op.operand];
    }
};

const day17 = (lines: string[]): [number, number] => {
    const [state, ops] = parseProgram(lines);

    return [
        0,
        0
    ];
};

(async () => {
    const input = await readInputLines('day17');
    const [part1, part2] = day17(input);

    console.log(part1);
    console.log(part2);
})();