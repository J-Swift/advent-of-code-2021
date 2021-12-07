async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split(",").map(Number)
}

function getTotalCost(positions: number[], target: number) {
    return positions.reduce((memo, val) => memo + (Math.abs(target-val)), 0)
}

function getMostEfficient(positions: number[]) {
    const min = positions.reduce((memo, val) => val < memo ? val : memo, positions[0])
    const max = positions.reduce((memo, val) => val > memo ? val : memo, positions[0])

    let best = null
    for (let candidate = min; candidate <= max; candidate++) {
        const cost = getTotalCost(positions, candidate)
        if (best == null || cost < best) best = cost
    }
    return best
}

async function main() {
    const input = parseInput(await loadInput())
    const mostEfficient = getMostEfficient(input)
    console.log(mostEfficient)
}

main()
