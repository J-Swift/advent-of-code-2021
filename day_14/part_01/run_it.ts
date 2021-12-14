async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

function toRules(lines: string[]) {
    let template = lines[0]

    let rules = {} as {[key: string]: string}
    lines.slice(2).forEach(line => {
        let [left,right] = line.split(' -> ')
        rules[left] = left.charAt(0) + right + left.charAt(1)
    })

    return {template, lookup: rules}
}

function applyReplacements(template: string, replacements: {[key: string]: string}) {
    let lastPairMatched = false
    let res = ""
    for (let i=0; i<template.length-1; i++) {
        let pair = template.substring(i, i+2)
        let target = replacements[pair]
        if (target != null) {
            res += lastPairMatched ? target.substring(1,3) : target
        }
        lastPairMatched = target != null
    }
    return res
}

function getScore(s: string) {
    let occurances = s.split("").reduce((memo, val) => {
        memo[val] = (memo[val] ?? 0) + 1
        return memo
    }, {} as {[key: string]: number})
    let mostCommon = Object.entries(occurances).reduce(([k1, v1], [k2, v2]) => {
        return (v1 > v2) ? [k1, v1] : [k2, v2]
    })
    let leastCommon = Object.entries(occurances).reduce(([k1, v1], [k2, v2]) => {
        return (v1 < v2) ? [k1, v1] : [k2, v2]
    })

    console.log(`[most ${mostCommon[0]} ${mostCommon[1]}] [least ${leastCommon[0]} ${leastCommon[1]}]`)
    return mostCommon[1]-leastCommon[1]
}

async function main() {
    const input = parseInput(await loadInput())
    const parsed = toRules(input)

    let res = parsed.template
    for (let i=0; i<10; i++) {
        res = applyReplacements(res, parsed.lookup)
    }
    console.log(res.length)
    console.log(getScore(res))
}

main()
