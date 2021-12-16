import {SortedQueue} from './SortedQueue.ts'

async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n").map(it => it.split('').map(Number))
}

function expandGrid(grid: number[][]) {
    let scaleFactor = 5

    let lookup = [1,2,3,4,5,6,7,8,9]

    let res = new Array(grid.length * scaleFactor) as number[][]
    for (let y=0; y<res.length; y++){ 
        let row = new Array(grid[0].length * scaleFactor) as number[]
        for (let x=0; x<row.length; x++) {
            let origX = (x % grid[0].length), origY = (y % grid.length)
            let origValue = grid[origY][origX]
            let xShift = Math.floor(y / (grid.length))
            let yShift = Math.floor(x / (grid[0].length))

            row[x] = lookup[(origValue - 1 + xShift + yShift) % lookup.length]
        }
        res[y] = row
    }
    return res
}

type Coord = {
    x: number
    y: number
}

function isValidCoord(c: Coord, grid: number[][]) {
    return (0 <= c.x && c.x < grid[0].length) &&
        (0 <= c.y && c.y < grid.length)
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

function djikstra(grid: number[][], from: Coord, to: Coord) {
    const unvisited = new Set<string>()
    const lookup = {} as {[key: string]: DjCoord}

    grid.forEach((line, yIdx) => {
        line.forEach((val, xIdx) => {
            const n = {x: xIdx, y: yIdx, currentCost: Infinity, value: val}
            lookup[getKey(n)] = n
            unvisited.add(getKey(n))
        })
    })
    const q = new SortedQueue<DjCoord>(Array.from(Object.values(lookup)))

    let current = lookup[getKey(from)]
    q.remove(current)
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
                q.remove(djc)
                djc.currentCost = newCost
                q.push(djc)
            }
        })

        unvisited.delete(getKey(current))
        if (getKey(current) == getKey(to)) {
            return current
        }

        current = q.pop()
    }
}

async function main() {
    let grid = parseInput(await loadInput())
    grid = expandGrid(grid)
    const path = djikstra(grid, {x: 0, y: 0}, {x: grid[0].length-1, y: grid.length-1})
    console.debug(path)
}

main()
