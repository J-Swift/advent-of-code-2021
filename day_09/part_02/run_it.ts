async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

let DEBUG=false
function debugLog(msg: string) {
    if (DEBUG) console.debug(msg)
}

function parseInput(input: string) {
    return input.split("\n").map(it => it.split("").map(Number))
}

type Point = {
    x: number
    y: number
    value: number
}

function getKey(p: Point) {
    return `${p.x}--${p.y}--${p.value}`
}

function getBasin(points: number[][], around: Point, basin: Set<string>) {
    const row = around.x, col = around.y, val = around.value

    if (row != 0) {
        let p = {x: row-1, y: col, value: points[col][row-1]}
        let pKey = getKey(p)

        debugLog(`[${row} ${col}] testing left [${val}] [${points[col][row-1]}]`)
        // left
        if (p.value != 9 && val < p.value && !basin.has(pKey)) {
            basin.add(pKey)
            getBasin(points, p, basin).forEach(it => basin.add(it))
        }
    } else debugLog(`[${row} ${col}] skipping left`)

    if (row != points[0].length -1) {
        let p = {x: row+1, y: col, value: points[col][row+1]}
        let pKey = getKey(p)

        debugLog(`[${row} ${col}] testing right [${val}] [${points[col][row+1]}]`)
        // right
        if (p.value != 9 && val < p.value && !basin.has(pKey)) {
            basin.add(pKey)
            getBasin(points, p, basin).forEach(it => basin.add(it))
        }
    } else debugLog(`[${row} ${col}] skipping right`)

    if (col != 0) {
        let p = {x: row, y: col-1, value: points[col-1][row]}
        let pKey = getKey(p)

        debugLog(`[${row} ${col}] testing up [${val}] [${points[col-1][row]}]`)
        // up
        if (p.value != 9 && val < p.value && !basin.has(pKey)) {
            basin.add(pKey)
            getBasin(points, p, basin).forEach(it => basin.add(it))
        }
    } else debugLog(`[${row} ${col}] skipping up`)

    if (col != points.length - 1) {
        let p = {x: row, y: col+1, value: points[col+1][row]}
        let pKey = getKey(p)

        debugLog(`[${row} ${col}] testing down [${val}] [${points[col+1][row]}]`)
        // down
        if (p.value != 9 && val < p.value && !basin.has(pKey)) {
            basin.add(pKey)
            getBasin(points, p, basin).forEach(it => basin.add(it))
        }
    } else debugLog(`[${row} ${col}] skipping down`)

    return basin
}

function getLowPoints(points: number[][]) {
    let res = [] as Point[]

    for (let col=0; col < points.length; col++) {
        for (let row=0; row < points[0].length; row++) {
            let val = points[col][row]

            if (row != 0) {
                debugLog(`[${row} ${col}] testing left [${val}] [${points[col][row-1]}]`)
                // left
                if (val >= points[col][row-1]) continue
            } else debugLog(`[${row} ${col}] skipping left`)

            if (row != points[0].length -1) {
                debugLog(`[${row} ${col}] testing right [${val}] [${points[col][row+1]}]`)
                // right
                if (val >= points[col][row+1]) continue
            } else debugLog(`[${row} ${col}] skipping right`)

            if (col != 0) {
                debugLog(`[${row} ${col}] testing up [${val}] [${points[col-1][row]}]`)
                // up
                if (val >= points[col-1][row]) continue
            } else debugLog(`[${row} ${col}] skipping up`)

            if (col != points.length - 1) {
                debugLog(`[${row} ${col}] testing down [${val}] [${points[col+1][row]}]`)
                // down
                if (val >= points[col+1][row]) continue
            } else debugLog(`[${row} ${col}] skipping down`)

            debugLog(`[${row}] [${col}] is low [${val}]`)

            res.push({x: row, y: col, value: val})
        }
    }

    return res
}

async function main() {
    const points = parseInput(await loadInput())
    const lowPoints = getLowPoints(points)
    const res = lowPoints
        .map(it => getBasin(points, it, new Set([getKey(it)])))
        .map(it => it.size)
        .sort((a, b) => b-a)
        .slice(0,3)
        .reduce((memo, val) => memo*val)
    console.debug(res)
}

main()
