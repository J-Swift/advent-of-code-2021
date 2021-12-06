async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split(",").map(Number)
}

function convertToLookup(input: number[]) {
    const dummyArray = new Array(9)
    for (let idx = 0; idx < dummyArray.length; idx++) {
        dummyArray[idx] = 0
    }

    let res = [... dummyArray]
    input.forEach(it => res[it] += 1)
    return res
}

function simulate(input: number[], numDays: number) {
    const dummyArray = new Array(9)
    for (let idx = 0; idx < dummyArray.length; idx++) {
        dummyArray[idx] = 0
    }

    let res = input
    for (let day = 0; day < numDays; day++) {
        let newInput = [... dummyArray]
        for (let idx = 1; idx <= 8; idx++) {
            newInput[idx-1] = res[idx]
        }
        newInput[6] += res[0]
        newInput[8] += res[0]
        res = newInput
    }

    return res
}

async function main() {
    const input = parseInput(await loadInput())
    const converted = convertToLookup(input)
    const simulated = simulate(converted, 256)
    console.log(simulated.reduce((memo, val) => memo + val))
}

main()
