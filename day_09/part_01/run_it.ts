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

function getLowPoints(points: number[][]) {
    let res = [] as number[]

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

            res.push(val)
        }
    }

    return res
}

async function main() {
    const input = parseInput(await loadInput())
    const lowPoints = getLowPoints(input)
    console.log(lowPoints.reduce((memo, val) => memo+val+1, 0))
}

main()
