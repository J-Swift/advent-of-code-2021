async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n").map(it => it.split('').map(Number))
}

type Coord = {
    x: number
    y: number
}

type DjCoord = {
    x: number
    y: number
    value: number
    currentCost: number
}

function getKey(c: {x: number, y: number}) {
    return `${c.x}--${c.y}`
}


function isValidCoord(c: Coord, grid: number[][]) {
    return (0 <= c.x && c.x < grid[0].length) &&
        (0 <= c.y && c.y < grid.length)
}

function getTotalCost(path: Coord[], grid: number[][]) {
    return path.reduce((memo, val) => {
        return memo + grid[val.y][val.x]
    }, 0)
}

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
function djikstra(grid: number[][], from: Coord, to: Coord) {
    let unvisited = new Set<string>()
    let lookup = {} as {[key: string]: DjCoord}
    grid.forEach((line, yIdx) => {
        line.forEach((val, xIdx) => {
            const n = {x: xIdx, y: yIdx, currentCost: Infinity, value: val}
            lookup[getKey(n)] = n
            unvisited.add(getKey(n))
        })
    })

    let current = lookup[getKey(from)]
    current.currentCost = 0

    while(true) {
        let unvisitedNeighbors = [
            {x: current.x-1, y: current.y}, {x: current.x+1, y: current.y},
            {x: current.x, y: current.y-1}, {x: current.x, y: current.y+1},
        ].filter(it => isValidCoord(it, grid) && unvisited.has(getKey(it)))

        unvisitedNeighbors.forEach(it => {
            let djc = lookup[getKey(it)]
            let newCost = djc.value + current.currentCost
            if (newCost < djc.currentCost) {
                djc.currentCost = newCost
            }
        })

        unvisited.delete(getKey(current))
        if (getKey(current) == getKey(to)) {
            return current
        }
        current = Array.from(unvisited).map(it => lookup[it]).reduce((a,b) => a.currentCost < b.currentCost ? a : b)
    }
}

async function main() {
    const input = parseInput(await loadInput())
    const path = djikstra(input, {x: 0, y: 0}, {x: input[0].length-1, y: input.length-1})
    console.debug(path)
}

main()
