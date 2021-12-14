async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

function toRules(lines: string[]) {
    let template = lines[0]

    let rules = {} as {[key: string]: string[]}
    lines.slice(2).forEach(line => {
        let [left,right] = line.split(' -> ')
        rules[left] = [left.charAt(0) + right,  right + left.charAt(1)]
    })

    return {template, lookup: rules}
}

function getScore(ticks: number, template: string, replacements: {[key: string]: string[]}): number {
    let res = {} as {[key: string]: number}

    // initial totals
    for (let i=0; i<template.length-1; i++) {
        let pair = template.substring(i, i+2)
        res[pair] = (res[pair] ?? 0) + 1
    }

    for (let tick = 0; tick < ticks; tick++) {
        let newRes = {} as {[key: string]: number}
        Object.entries(res).forEach(([k, v]) => {
            (replacements[k] ?? [k]).forEach(pair => {
                newRes[pair]= (newRes[pair] ?? 0) + v
            })
        })
        res = newRes
    }

    let occurances = Object.entries(res).reduce((memo, [k,v]) => {
        memo[k.charAt(0)] = (memo[k.charAt(0)] ?? 0) + v
        memo[k.charAt(1)] = (memo[k.charAt(1)] ?? 0) + v
        return memo
    }, {} as {[key: string]: number})

    let mostCommon = Object.entries(occurances).reduce(([k1, v1], [k2, v2]) => {
        return (v1 > v2) ? [k1, v1] : [k2, v2]
    })
    let leastCommon = Object.entries(occurances).reduce(([k1, v1], [k2, v2]) => {
        return (v1 < v2) ? [k1, v1] : [k2, v2]
    })

    console.log(`[most ${mostCommon[0]} ${Math.ceil(mostCommon[1]/2)}] [least ${leastCommon[0]} ${Math.ceil(leastCommon[1]/2)}]`)
    return Math.ceil(mostCommon[1]/2)-Math.ceil(leastCommon[1]/2)
}

async function main() {
    const input = parseInput(await loadInput())
    const parsed = toRules(input)

    console.log(getScore(40, parsed.template, parsed.lookup))
}

main()
