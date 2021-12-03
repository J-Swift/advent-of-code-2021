async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

function getMostCommon(inputs: string[], bit: number) {
    let res = 0

    inputs.forEach(it => {
        res += (it[bit] == "1" ? 1 : -1)
    })

    if (res == 0) return "="
    else if (res > 0) return "1"
    else return "0"
}


function getAllWithBitSetTo(inputs: string[], bit: number, target: string) {
    return inputs.filter(it => it[bit] == target)
}

function toNumber(binary: string) {
    return binary.split("").reduceRight((memo, val, idx) => {
        const realIdx = binary.length - idx - 1
        return memo + (+val * 2**realIdx)
    }, 0)
}

async function main() {
    const origInput = parseInput(await loadInput())

    let idx = 0
    let input = origInput
    while(input.length > 1) {
        const mostCommon = getMostCommon(input, idx)
        input = getAllWithBitSetTo(input, idx, mostCommon == "0" ? "0" : "1")
        idx++
    }
    const oxygen = input[0]

    idx = 0
    input = origInput
    while(input.length > 1) {
        const mostCommon = getMostCommon(input, idx)
        input = getAllWithBitSetTo(input, idx, mostCommon == "0" ? "1" : "0")
        idx++
    }
    const co2 = input[0]

    console.log(`[${oxygen}] [${co2}] [${toNumber(oxygen) * toNumber(co2)}]`)
}

main()
