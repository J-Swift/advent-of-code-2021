async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type Coord = {
    x: number
    y: number
}

// e.g.
// 3,4 -> 1,4 becomes [{x:3,y:4}, {x:1,y:4}]
function toCoords(input: string[]): Coord[][] {
    return input.map(it => {
        let parts = it.split(" ")
        let pt1 = parts[0].split(",").map(Number)
        let pt2 = parts[2].split(",").map(Number)
        return [{x: pt1[0], y: pt1[1]}, {x: pt2[0], y: pt2[1]}]
    })
}

function areSamePoint(pt1: Coord, pt2: Coord) {
    return (pt1.x == pt2.x && pt1.y == pt2.y)
}

function generatePointsInclusive(pt1: Coord, pt2: Coord) {
    let stepX = 0, stepY = 0

    if (pt1.x < pt2.x) stepX = 1
    else if (pt2.x < pt1.x) stepX = -1

    if (pt1.y < pt2.y) stepY = 1
    else if (pt2.y < pt1.y) stepY = -1

    let res = []
    let current = pt1
    while (!areSamePoint(current, pt2)) {
        res.push(current)
        current = {x: current.x + stepX, y: current.y + stepY}
    }
    res.push(current)
    return res
}

function countPoints(coordPairs: Coord[][]) {
    const res: {[key: string]: number} = {}
    coordPairs.forEach(pair => {
        let expanded = generatePointsInclusive(pair[0], pair[1])
        expanded.forEach(it => {
            const key = `${it.x},${it.y}`
            res[key] = (res[key] ?? 0) + 1
        })
    })
    return res
}

async function main() {
    const input = parseInput(await loadInput())
    const coords = toCoords(input)
    const counted = countPoints(coords)
    console.log(Object.values(counted).filter(it => it > 1).length)
}

main()
