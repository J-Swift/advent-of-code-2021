async function loadInput() {
    return await Deno.readTextFile("./input.txt");
}

function parseInput(input: string) {
    return input.split("\n").map(it => +it);
}

function countIncreasing(nums: number[]) {
    let res = 0;
    let prev = 0;
    nums.forEach((it, idx) => {
        if (idx == 0) {
            prev = it;
            return;
        }
        if (it > prev) res += 1;
        prev = it;
    });
    return res;
}

async function main() {
    const nums = parseInput(await loadInput());
    console.log(countIncreasing(nums));
}

main()
