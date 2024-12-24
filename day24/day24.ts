import { readInputLines, splitOn } from "../shared/utils";

type Op = 'AND' | 'OR' | 'XOR';
type Wires = Map<string, number | Gate>;
type Gate = [string, Op, string];

const parseInput = (lines: string[]): Wires => {
    const wires = new Map<string, number | Gate>();
    const [initial, gates] = splitOn(lines, '');
    for (const init of initial) {
        const [label, num] = init.split(': ');
        wires.set(label, parseInt(num, 10));
    }

    for (const gate of gates) {
        const [a, b, c, _, d] = gate.split(' ');
        wires.set(d, [a, b as Op, c]);
    }

    return wires;
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

const evaluate = (label: string, wires: Wires): number => {
    const wire = wires.get(label)!;
    if (typeof wire === 'number') {
        return wire;
    }

    const [wireA, op, wireB] = wire;
    const a = evaluate(wireA, wires);
    const b = evaluate(wireB, wires);
    const v = exec(a, op, b);
    wires.set(label, v);
    return v; 
};

const readNum = (prefix: string, wires: Wires): string => {
    return [...wires.keys()]
        .filter(w => w.startsWith(prefix))
        .toSorted()
        .map(w => evaluate(w, wires))
        .toReversed()
        .join('');
}

const day24 = (lines: string[]): [number, number] => {
    const wires = parseInput(lines);
    const x = readNum('x', wires);
    const y = readNum('y', wires);
    const z1 = readNum('z', wires);
    const z2 = (parseInt(x, 2) + parseInt(y, 2)).toString(2);

    return [
        parseInt(readNum('z', wires), 2),
        0,
    ];
};

(async () => {
    const input = await readInputLines('day24');
    const [part1, part2] = day24(input);

    console.log(part1);
    console.log(part2);
})();