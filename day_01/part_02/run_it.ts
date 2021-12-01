async function loadInput() {
    return await Deno.readTextFile("./input.txt");
}

function parseInput(input: string) {
    return input.split("\n").map(it => +it);
}

function countIncreasing(nums: number[]) {
    let res = 0;
    for(let left = 0, right=1; left < nums.length - 3; left++, right++) {
        const leftSum = nums[left] + nums[left+1] + nums[left+2];
        const rightSum = nums[right] + nums[right+1] + nums[right+2];
        if (rightSum > leftSum) res++;
    }
    return res;
}

async function main() {
    const nums = parseInput(await loadInput());
    console.log(countIncreasing(nums));
}

main()
