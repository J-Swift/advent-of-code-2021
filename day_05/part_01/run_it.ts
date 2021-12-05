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

function countPoints(coordPairs: Coord[][]) {
    const res: {[key: string]: number} = {}
    coordPairs.forEach(pair => {
        const pt1 = pair[0], pt2 = pair[1]
        // only straight lines
        if (! ((pt1.x==pt2.x) || (pt1.y==pt2.y)) ) {
            return
        }

        let start, end, isHorizontal
        if (pt1.x < pt2.x) {
            start = pt1.x, end = pt2.x, isHorizontal = true
        } else if (pt2.x < pt1.x) {
            start = pt2.x, end = pt1.x, isHorizontal = true
        } else if (pt1.y < pt2.y) {
            start = pt1.y, end = pt2.y, isHorizontal = false
        } else if (pt2.y < pt1.y) {
            start = pt2.y, end = pt1.y, isHorizontal = false
        } else {
            throw `Weird Coord: [${pt1.x}, ${pt1.y}] [${pt2.x}, ${pt2.y}]`
        }

        // console.log(`[${pt1.x}, ${pt1.y}] [${pt2.x}, ${pt2.y}]:`)
        for (let i = start; i <= end; i++) {
            const currentPoint =  isHorizontal ? {x: i, y: pt1.y} : {x: pt1.x, y: i}
            // console.log(`   [${currentPoint.x}, ${currentPoint.y}]`)
            const key = `${currentPoint.x},${currentPoint.y}`
            res[key] = (res[key] ?? 0) + 1
        }
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
