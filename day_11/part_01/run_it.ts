async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n").map(it => it.split("").map(Number))
}

function increment(grid: number[][]) {
    return grid.map(line => line.map(it => it+1))
}

function getKey(row: number, col: number) {
    return `[${row}][${col}]`
}

function doFlash(grid: number[][], row: number, col: number) {
    for (let colIdx=col-1; colIdx<=col+1; colIdx++) {
        if (0 <= colIdx && colIdx < grid.length) {
            for (let rowIdx=row-1; rowIdx<=row+1; rowIdx++) {
                if (0 <= rowIdx && rowIdx < grid[0].length) {
                    if (!(rowIdx == row && colIdx == col)) {
                        grid[colIdx][rowIdx]++
                    }
                }
            }
        }
    }
}

function resolveFlashes(grid: number[][], flashed = new Set<string>()) {
    let startingFlashes = flashed.size

    do {
        startingFlashes = flashed.size
        grid.forEach((line, colIdx) => {
            line.forEach((cell, rowIdx) => {
                let key = getKey(rowIdx, colIdx)
                if (cell > 9 && !flashed.has(key)) {
                    flashed.add(key)
                    doFlash(grid, rowIdx, colIdx)
                }
            })
        })
    } while(startingFlashes!=flashed.size)

    grid.forEach((line, colIdx) => {
        line.forEach((cell, rowIdx) => {
            if (cell > 9) {
                grid[colIdx][rowIdx] = 0
            }
        })
    })

    return {grid, flashes: flashed.size}
}

function tick(grid: number[][]) {
    let flashes = 0

    grid = increment(grid)
    return resolveFlashes(grid)
}

function display(g: {grid: number[][], flashes: number}) {
    console.log('--------------------')
    console.log(g.flashes)
    console.log()
    g.grid.forEach(line => {
        console.log(line.join(""))
    })
}

async function main() {
    const input = parseInput(await loadInput())

    let t1 = {grid: input, flashes: 0}
    display(t1)
    let total = 0
    for (let ticks=0; ticks<100; ticks++) {
        t1 = tick(t1.grid)
        display(t1)
        total+= t1.flashes
        console.log(`TOTAL TICKS: [${total}]`)
    }
}

main()
