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

type Fold = {
    dir: 'x' | 'y'
    value: number
}

function toInstructions(lines: string[]) {
    let dots = []  as Coord[]
    let folds = [] as Fold[]

    lines.forEach(line => {
        if (line == '') return

        if (line.startsWith('fold')) {
            let [dir,val] = line.replace('fold along ', '').split('=')
            folds.push({dir: dir as 'x'|'y', value: Number(val)})
        } else {
            let [x,y] = line.split(',').map(Number)
            dots.push({x,y})
        }
    })

    return {dots,folds}
}

function fillInDots(dots: Coord[]) {
    const maxX = dots.reduce((memo, val) =>  (val.x >= memo ? val.x : memo), 0)
    const maxY = dots.reduce((memo, val) =>  (val.y >= memo ? val.y : memo), 0)

    const grid = Array(maxY+1) as number[][]
    for (let idxY=0; idxY<=maxY; idxY++) {
        grid[idxY] = Array(maxX+1) as number[]
        for (let idxX=0; idxX<=maxX; idxX++) {
            grid[idxY][idxX] = 0
        }
    }

    dots.forEach(dot => grid[dot.y][dot.x] = 1)
    return grid
}

function translateCoordForFold(c: Coord, f: Fold) {
    switch(f.dir) {
        case 'x': return {x: (f.value > c.x ? c.x : 2*f.value-c.x), y: c.y}
        case 'y': return {x: c.x, y: (f.value > c.y ? c.y : 2*f.value-c.y)}
    }
}

function generateNewGridAfterFold(grid: number[][], f: Fold) {
    let lenX = (f.dir == 'x' ? f.value : grid[0].length)
    let lenY = (f.dir == 'x' ? grid.length : f.value)

    const newGrid = Array(lenY) as number[][]
    for (let idxY=0; idxY<lenY; idxY++) {
        newGrid[idxY] = Array(lenX) as number[]
        for (let idxX=0; idxX<lenX; idxX++) {
            newGrid[idxY][idxX] = grid[idxY][idxX]
        }
    }
    return newGrid
}

function doFold(grid: number[][], f: Fold) {
    for (let idxY=0; idxY<grid.length; idxY++) {
        for (let idxX=0; idxX<grid[0].length; idxX++) {
            const translated = translateCoordForFold({x: idxX, y: idxY}, f)
            grid[translated.y][translated.x] = Math.min(1, grid[idxY][idxX] + grid[translated.y][translated.x])
        }
    }
    return generateNewGridAfterFold(grid, f)
}

function countVisible(grid: number[][]) {
    let visible = 0
    grid.forEach(row => row.forEach(val => visible+=val))
    return visible
}

async function main() {
    const input = parseInput(await loadInput())
    const parsed = toInstructions(input)

    let grid = fillInDots(parsed.dots)

    grid = doFold(grid, parsed.folds[0])
    console.log(countVisible(grid))
}

main()
