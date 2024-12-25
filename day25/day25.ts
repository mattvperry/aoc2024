import { readInputLines, size, splitOnEvery, zipWith } from "../shared/utils";

type Shape = number[];

const parseInput = (lines: string[]): [Shape[], Shape[]] => {
    const keys: Shape[] = [];
    const locks: Shape[] = [];
    
    for (const obj of splitOnEvery(lines, '')) {
        const type = [...obj[0]].every(x => x === '#') ? keys : locks;
        const shape = obj
            .slice(1, -1)
            .map(r => [...r].map(c => c === '#' ? 1 : 0 as number))
            .reduce((acc, curr) => zipWith(acc, curr, (a, b) => a + b));
        type.push(shape);
    }

    return [keys, locks];
};

function* matches(keys: Shape[], locks: Shape[]): Iterable<[Shape, Shape]> {
    for (const key of keys) {
        for (const lock of locks) {
            if (zipWith(key, lock, (a, b) => a + b).every(s => s < 6)) {
                yield [key, lock];
            }
        }
    }
}

const day25 = (lines: string[]): number => {
    const [keys, locks] = parseInput(lines);
    return size(matches(keys, locks));
};

(async () => {
    const input = await readInputLines('day25');
    const part1 = day25(input);

    console.log(part1);
})();