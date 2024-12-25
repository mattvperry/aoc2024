import { memoize, readInputLines, splitOn } from "../shared/utils";

type Op = 'AND' | 'OR' | 'XOR';
type Wires = Map<string, number>;
type Gate = [string, Op, string];
type Gates = Map<string, Gate>;
type Nums = { x: number[], y: number[], z: number[] };

const parseInput = (lines: string[]): [Wires, Gates] => {
    const wires = new Map<string, number>();
    const gates = new Map<string, Gate>();
    const [initial, gs] = splitOn(lines, '');
    for (const init of initial) {
        const [label, num] = init.split(': ');
        wires.set(label, parseInt(num, 10));
    }

    for (const gate of gs) {
        const [a, b, c, _, d] = gate.split(' ');
        gates.set(d, [a, b as Op, c]);
    }

    return [wires, gates];
}

const exec = (a: number, op: Op, b: number): number => {
    switch (op) {
        case 'AND':
            return a & b;
        case 'OR':
            return a | b;
        case 'XOR':
            return a ^ b;
    }
};

const evaluate = memoize((label: string, wires: Wires, gates: Gates, swaps: [string, string][]): number => {
    const wire = wires.get(label);
    if (wire !== undefined) {
        return wire;
    }

    const [wireA, op, wireB] = gates.get(label)!;
    const valA = evaluate(wireA, wires, gates, swaps);
    const valB = evaluate(wireB, wires, gates, swaps);
    return exec(valA, op, valB);
}, (l, _, __, s) => `${l}_${s.flatMap(x => x).toSorted().join('')}`);

const readNums = (wires: Wires, gates: Gates, swaps: [string, string][]): Nums => {
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];

    for (const w of [...wires.keys(), ...gates.keys()]) {
        const val = evaluate(w, wires, gates, swaps);
        switch (w[0]) {
            case 'x':
                x[parseInt(w.slice(1), 10)] = val;
                break;
            case 'y':
                y[parseInt(w.slice(1), 10)] = val;
                break;
            case 'z':
                z[parseInt(w.slice(1), 10)] = val;
                break;
        }
    }

    return { x, y, z }
}

const parseNum = (x: Nums[keyof Nums]): number => {
    return parseInt(x.toReversed().join(''), 2);
};

const swap = (wires: Wires, gates: Gates, { x, y, z }: Nums): string[] => {
    const swaps: string[] = [];
    for (const [output, [a, op, b]] of gates) {
        if (output.startsWith('z')
            && op !== 'XOR'
            && output !== 'z45') {
            swaps.push(output);
        } else if (!output.startsWith('z')
            && !a.startsWith('x')
            && !b.startsWith('x')
            && !a.startsWith('y')
            && !b.startsWith('y')
            && op === 'XOR') {
            swaps.push(output);
        } else if (((a.startsWith('x') && b.startsWith('y'))
            || (b.startsWith('x') && a.startsWith('y')))
            && output !== 'z00'
            && op === 'XOR'
            && [...gates.values()].find(([a2, op2, b2]) => op2 === 'XOR' && (a2 === output || b2 === output)) === undefined) {
            swaps.push(output);
        } else if (op === 'AND'
            && output !== 'drq'
            && [...gates.values()].find(([a2, op2, b2]) => op2 === 'OR' && (a2 === output || b2 === output)) === undefined) {
            swaps.push(output);
        }
    }

    return swaps;
};

const day24 = (lines: string[]): [number, string] => {
    const [wires, gates] = parseInput(lines);
    const { x, y, z } = readNums(wires, gates, []);
    const swaps = swap(wires, gates, { x, y, z});

    return [
        parseNum(z),
        swaps.toSorted().join(','),
    ];
};

(async () => {
    const input = await readInputLines('day24');
    const [part1, part2] = day24(input);

    console.log(part1);
    console.log(part2);
})();