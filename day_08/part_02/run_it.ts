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
        const [signals, output] = it.split(" | ").map(parts => parts.split(" ").map(part => part.split("").sort().join("")))
        return {signals, output} as Case
    })
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function intersection<T>(setA: Set<T>, setB: Set<T>) {
    let _intersection = new Set<T>()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function permutations(letters: Set<string>) {
    if (letters.size == 0) return [""]

    let res: string[] = []
    letters.forEach(letter => {
        const next = new Set(letters)
        next.delete(letter)
        const perms = permutations(next)
        res = res.concat(perms.map(it => letter + it))
    })
    return res
}

// shoutout to John Sickels for the approach
function solveCase(c: Case) {
    let segmentMappings: {[key: number]: Set<string>} = {}
    let lookup: {[key: string]: number} = {}

    // 1,4,7,8

    let encoded_1 = c.signals.find(it => it.length == 2) as string
    segmentMappings[1] = new Set(encoded_1.split(""))
    lookup[encoded_1] = 1

    let encoded_4 = c.signals.find(it => it.length == 4) as string
    segmentMappings[4] = new Set(encoded_4.split(""))
    lookup[encoded_4] = 4

    let encoded_7 = c.signals.find(it => it.length == 3) as string
    segmentMappings[7] = new Set(encoded_7.split(""))
    lookup[encoded_7] = 7

    let encoded_8 = c.signals.find(it => it.length == 7) as string
    segmentMappings[8] = new Set(encoded_8.split(""))
    lookup[encoded_8] = 8

    // 0,6,9

    let possible_069s = c.signals.filter(it => it.length == 6)

    let encoded_6 = possible_069s.find(it => intersection(new Set(it.split("")), segmentMappings[1]).size == 1) as string
    segmentMappings[6] = new Set(encoded_6.split(""))
    lookup[encoded_6] = 6

    let encoded_9 = possible_069s.find(it => intersection(new Set(it.split("")), segmentMappings[4]).size == 4 && it != encoded_6) as string
    segmentMappings[9] = new Set(encoded_9.split(""))
    lookup[encoded_9] = 9

    let encoded_0 = possible_069s.find(it => it != encoded_6 && it != encoded_9) as string
    segmentMappings[0] = new Set(encoded_0.split(""))
    lookup[encoded_0] = 0

    // 2,3,5

    let possible_235s = c.signals.filter(it => it.length == 5)

    let encoded_3 = possible_235s.find(it => intersection(new Set(it.split("")), segmentMappings[1]).size == 2) as string
    segmentMappings[3] = new Set(encoded_3.split(""))
    lookup[encoded_3] = 3

    let encoded_5 = possible_235s.find(it => intersection(new Set(it.split("")), segmentMappings[4]).size == 3 && it != encoded_3) as string
    segmentMappings[5] = new Set(encoded_5.split(""))
    lookup[encoded_5] = 5

    let encoded_2 = possible_235s.find(it => it != encoded_3 && it != encoded_5) as string
    segmentMappings[2] = new Set(encoded_2.split(""))
    lookup[encoded_2] = 2

    return c.output.map(it => lookup[it])
}

const trueMappingsInverse = {
    'abcefg': 0,
    'cf': 1,
    'acdeg': 2,
    'acdfg': 3,
    'bcdf': 4,
    'abdfg': 5,
    'abdefg': 6,
    'acf': 7,
    'abcdefg': 8,
    'abcdfg': 9,
} as {[key: string]: number}

function convertTo(source: string, mapping: string[]) {
    return source.split("").map(it => {
        let code = it.charCodeAt(0) - "a".charCodeAt(0)
        return mapping[code]
    }).sort().join("")
}

function solveCaseBrute(c: Case, perms: string[][]) {
    let encodedDigits = c.signals
    let perm = perms.find(it => {
        let idx = 0
        while(idx<encodedDigits.length) {
            let converted = convertTo(encodedDigits[idx], it)
            if (trueMappingsInverse[converted] == null) return false
            idx++
        }
        return true
    })

    return c.output.map(it => trueMappingsInverse[convertTo(it, perm as string[])])
}

async function main() {
    const input = parseInput(await loadInput())
    const normalized = normalize(input)

    let sum = normalized.reduce((memo, val) => memo + parseInt(solveCase(val).join(""), 10), 0)
    console.log(sum)

    const perms = permutations(new Set("abcdefg".split(""))).map(it => it.split(""))
    sum = normalized.reduce((memo, val) => memo + parseInt(solveCaseBrute(val, perms).join(""), 10), 0)
    console.log(sum)
}

main()
