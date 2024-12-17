import { MinPriorityQueue } from '@datastructures-js/priority-queue';

export type Point = [number, number];
export type PointS = `${number}_${number}`;
export type Grid<T = number> = Map<PointS, T>;

export type Node = {
    pos: Point,
}

type State<TNode extends Node> = {
    key: string,
    node: TNode,
    cost: number,
    prev: State<TNode> | null,
};

export const toStr = ([x, y]: Point): PointS => `${x}_${y}`;
export const fromStr = (p: PointS): Point => p.split('_').map(x => parseInt(x, 10)) as Point;

export const shortestPath = <TNode extends Node>(
    initial: [TNode, number][],
    end: Point,
    getKey: (node: TNode) => string,
    next: (curr: TNode) => Iterable<[TNode, number]>,
    finish?: (node: TNode) => boolean,
): State<TNode> | undefined => {
    const visited = new Set<string>();
    const queue = MinPriorityQueue.fromArray(initial.map<State<TNode>>(([node, cost]) => ({
        key: getKey(node),
        node,
        cost,
        prev: null,
    })), s => s.cost);

    while (queue.size() > 0) {
        const curr = queue.dequeue();
        if (visited.has(curr.key)) {
            continue;
        }

        visited.add(curr.key);
        if (toStr(curr.node.pos) === toStr(end) && (finish?.(curr.node) ?? true)) {
            return curr;
        }

        for (const [node, cost] of next(curr.node)) {
            if (cost === undefined) {
                continue;
            }

            queue.enqueue({
                key: getKey(node),
                node,
                cost: curr.cost + cost,
                prev: curr,
            });
        }
    }
};