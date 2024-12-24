import { countBy, readInputLines, reduce2 } from "../shared/utils";

type Net = Map<string, Set<string>>;

const parseNet = (lines: string[]): Net => {
    const net = new Map<string, Set<string>>();
    for (const edge of lines) {
        const [a, b] = edge.split('-');
        net.set(a, new Set<string>([...(net.get(a) ?? []), b]));
        net.set(b, new Set<string>([...(net.get(b) ?? []), a]));
    }

    return net;
};

function* components(net: Net): Iterable<[string, string, string]> {
    const seen = new Set<string>();
    for (const pc of net.keys()) {
        const adj = net.get(pc)!;
        for (const a1 of adj) {
            for (const a2 of adj) {
                if (!net.get(a1)!.has(a2)) {
                    continue;
                }

                const hash = [pc, a1, a2].toSorted().join('_');
                if (!seen.has(hash)) {
                    seen.add(hash);
                    yield [pc, a1, a2];
                }
            }
        }
    }
}

function* cliques(r: Set<string>, p: Set<string>, x: Set<string>, net: Net): Iterable<Set<string>> {
    if (p.size === 0 && x.size === 0) {
        yield r;
    }

    for (const v of p) {
        const set = new Set<string>([v]);
        const ns = net.get(v)!;
        yield* cliques(r.union(set), p.intersection(ns), x.intersection(ns), net);
        p = p.difference(set);
        x = x.union(set);
    }
}

const day23 = (lines: string[]): [number, string] => {
    const net = parseNet(lines);
    const max = reduce2(
        cliques(new Set<string>(), new Set<string>(net.keys()), new Set<string>(), net),
        (acc, curr) => acc.size > curr.size ? acc : curr);

    return [
        countBy(components(net), c => c.some(x => x.startsWith('t'))),
        [...max].toSorted().join(','),
    ];
};

(async () => {
    const input = await readInputLines('day23');
    const [part1, part2] = day23(input);

    console.log(part1);
    console.log(part2);
})();