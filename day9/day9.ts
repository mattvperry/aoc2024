import { map, reduce, filter, readInputLines, sum } from '../shared/utils';

type Node = {
    contents: number | null,
    start: number,
    size: number,
    prev: Node | null,
    next: Node | null,
};

type Disk = { head: Node, tail: Node };

const parseDisk = (line: string): Disk => {
    const [n, ...ns] = line.split('').map(d => parseInt(d, 10));
    const head: Node = {
        contents: 0,
        start: 0,
        size: n,
        prev: null,
        next: null,
    };
    let id = 1;
    let curr = head;
    for (let i = 0; i < ns.length; ++i) {
        if (ns[i] === 0) {
            continue;
        }

        const node: Node = {
            contents: i % 2 === 1 ? id++ : null,
            start: curr.start + curr.size,
            size: ns[i],
            prev: curr,
            next: null,
        };

        curr.next = node;
        curr = node;
    }

    return { head, tail: curr };
};

function* iterate({ head }: Disk): Iterable<Node> {
    let curr: Node | null = head;
    while (curr !== null) {
        yield curr;
        curr = curr.next;
    }
}

function* iterateL({ tail }: Disk): Iterable<Node> {
    let curr: Node | null = tail;
    while (curr !== null) {
        yield curr;
        curr = curr.prev;
    }
}

const compact = (disk: Disk): Disk => {
    let free: Node | null = disk.head;
    let file: Node | null = disk.tail;

    do {
        if (free.contents !== null) {
            free = free.next;
            continue;
        }

        if (file === null || file.prev === null || free.prev === null) {
            throw new Error('Invalid');
        }

        if (file.contents === null) {
            file = file.prev;
            continue;
        }

        if (free.size === file.size) {
            free.contents = file.contents;
            file.prev.next = file.next;
            file = file.prev;
            free = free.next;
        } else if (free.size > file.size) {
            // Remove file from current position
            const nextFile: Node = file.prev;
            file.prev.next = file.next;

            // Insert file into free space
            free.prev.next = file;
            file.prev = free.prev;
            file.next = free; 

            // Modify
            file.start = free.start;
            free.start += file.size;
            free.size -= file.size;
            free.prev = file;

            // Move on
            file = nextFile;
        } else if (free.size < file.size) {
            free.contents = file.contents;
            file.size -= free.size;
            free = free.next;
        }
    } while (free !== null && free.start < file.start);

    return disk;
};

const compact2 = (disk: Disk): Disk => {
    const lookup = new Map<number, Node>(map(filter(iterate(disk), x => x.contents !== null), n => [n.contents!, n]));

    for (let i = lookup.size - 1; i >= 0; --i) {
        const file = lookup.get(i)!;
        const [free] = filter(iterate(disk), n => n.contents === null && n.size >= file.size);
        if (free === undefined || free.start > file.start) {
            continue;
        }

        if (free.prev === null || file.prev === null) {
            throw new Error('Invalid');
        }

        file.prev.next = file.next;
        if (file.next !== null) {
            file.next.prev = file.prev;
        }

        if (free.size === file.size) {
            free.contents = file.contents;
        } else if (free.size > file.size) {
            // Insert file into free space
            free.prev.next = file;
            file.prev = free.prev;
            file.next = free; 

            // Modify
            file.start = free.start;
            free.start += file.size;
            free.size -= file.size;
            free.prev = file;
        }
    }

    return disk;
};

const checksum = (disk: Disk): number => {
    return reduce(
        filter(iterate(disk), n => n.contents !== null),
        0,
        (acc, cur) => acc + sum(Array.from({ length: cur.size }, (_, i) => cur.contents! * (i + cur.start)))
    );
};

const day9 = ([line]: string[]): [number, number] => {
    return [
        checksum(compact(parseDisk(line))),
        checksum(compact2(parseDisk(line))),
    ];
};

(async () => {
    const input = await readInputLines('day9');
    const [part1, part2] = day9(input);

    console.log(part1);
    console.log(part2);
})();