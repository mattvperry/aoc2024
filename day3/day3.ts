import { sum, map, readInputLines } from '../shared/utils';

const mulRegex = 'mul\\((?<x>\\d+?),(?<y>\\d+?)\\)';
const conditionalRegex = "(do\\(\\)|don't\\(\\))";

const muls = (line: string): number => {
    return sum(
        map(line.matchAll(new RegExp(mulRegex, 'g')),
        match => parseInt(match.groups?.['x'] ?? '0', 10) * parseInt(match.groups?.['y'] ?? '0', 10))
    );
};

const combined = (line: string): number => {
    let on = true;
    let sum = 0;
    for (const match of line.matchAll(new RegExp(`(${mulRegex}|${conditionalRegex})`, 'g'))) {
        if (match[0] === 'do()') {
            on = true;
        } else if (match[0] === "don't()") {
            on = false;
        } else if (match[0].startsWith('mul') && on) {
            sum += parseInt(match.groups?.['x'] ?? '0', 10) * parseInt(match.groups?.['y'] ?? '0', 10);
        }
    }

    return sum;
};

const day3 = (line: string): [number, number] => {
    return [
        muls(line),
        combined(line),
    ];
};

(async () => {
    const input = await readInputLines('day3');
    const [part1, part2] = day3(input.join(''));

    console.log(part1);
    console.log(part2);
})();