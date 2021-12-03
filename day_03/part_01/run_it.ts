async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

function getGamma(inputs: string[]) {
    let res = new Array(inputs[0].length)
    for (let i=0; i<res.length; i++) {
        res[i] = 0
    }

    inputs.forEach(it => {
        it.split("").forEach((char, idx) => {
            res[idx] += (char == "1" ? 1 : -1)
        });
    })
    return res.map(it => it > 0 ? "1" : "0").join("")
}

function getEpisilon(gamma: string) {
    return gamma.split("").map(it => it == "1" ? "0" : "1").join("")
}

function toNumber(binary: string) {
    return binary.split("").reduceRight((memo, val, idx) => {
        const realIdx = binary.length - idx - 1
        return memo + (+val * 2**realIdx)
    }, 0)
}

async function main() {
    const input = parseInput(await loadInput())
    const gamma = getGamma(input)
    const epsilon = getEpisilon(gamma)
    console.log(`[${gamma}] [${epsilon}] [${toNumber(gamma)}] [${toNumber(epsilon)}] [${toNumber(gamma) * toNumber(epsilon)}]`)
}

main()
