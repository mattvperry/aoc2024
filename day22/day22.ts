import { map, mod, readInputLines, repeatFn, scan, sumBy } from "../shared/utils";

const mix = (a: number, b: number): number => {
    return a ^ b;
};

const prune = (a: number): number => {
    return mod(a, 16777216);
};

const next = (num: number): number => {
    num = prune(mix(num, num * 64));
    num = prune(mix(num, Math.floor(num / 32)));
    num = prune(mix(num, num * 2048));
    return num;
};

const sequence = (initial: number, times: number): [number, number][] => {
    const seq = Array.from(map(scan(initial, times, next), x => mod(x, 10)));
    const res: [number, number][] = [];
    for (let i = 1; i < seq.length; ++i) {
        res.push([seq[i], seq[i] - seq[i - 1]]);
    }

    return res;
};

const mapSeq = (seq: [number, number][]): Map<string, number> => {
    const m = new Map<string, number>();
    for (let i = 3; i < seq.length; ++i) {
        const key = [3, 2, 1, 0].map(j => seq[i - j][1]).join('_');
        if (!m.has(key)) {
            m.set(key, seq[i][0]);
        }
    }

    return m;
};

const day22 = (lines: string[]): [number, number] => {
    const initials = lines.map(x => parseInt(x, 10));

    const maps = initials.map(x => mapSeq(sequence(x, 2000)));
    const seqs = maps.reduce((acc, curr) => acc.union(curr), new Set<string>());

    return [
        sumBy(initials, x => repeatFn(x, 2000, next)),
        Math.max(...map(seqs, x => sumBy(maps, m => m.get(x) ?? 0))),
    ];
};

(async () => {
    const input = await readInputLines('day22');
    const [part1, part2] = day22(input);

    console.log(part1);
    console.log(part2);
})();