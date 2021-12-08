async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type Case = {
    signals: string[]
    output: string[]
}

// e.g.
//   "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe"
//   {signals: [be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb], output: [fdgacbe cefdb cefbgd gcbe]}
function normalize(input: string[]) {
    return input.map(it => {
        const [signals, output] = it.split(" | ").map(parts => parts.split(" "))
        return {signals, output} as Case
    })
}

function getPossibleDigits(input: string) {
    switch(input.length) {
        case 6: return [0,6,9]
        case 2: return [1]
        case 5: return [2,3,5]
        case 4: return [4]
        case 3: return [7]
        case 7: return [8]
        default: throw `Malformed input [${input}]`
    }
}

async function main() {
    const input = parseInput(await loadInput())
    const normalized = normalize(input)
    const totalSingles = normalized.reduce((memo, val) => {
        const singles = val.output.filter(it => getPossibleDigits(it).length == 1)
        return memo + singles.length
    }, 0)
    console.log(totalSingles)
}

main()
