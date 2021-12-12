async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type Cave = {
    value: string
    connections: Set<Cave>
}

const isStart = (c: Cave) => c.value == 'start'
const isEnd = (c: Cave) => c.value == 'end'
const isSmallCave = (c: Cave) => !isStart(c) && !isEnd(c) && 'a'.charCodeAt(0) <= c.value.charCodeAt(0) && c.value.charCodeAt(0) <= 'z'.charCodeAt(0)
const isLargeCave = (c: Cave) => !isStart(c) && !isEnd(c) && 'A'.charCodeAt(0) <= c.value.charCodeAt(0) && c.value.charCodeAt(0) <= 'Z'.charCodeAt(0)

function toCaves(lines: string[]) {
    const caves = {} as {[key: string]: Cave}

    lines.forEach(it => {
        const [leftKey,rightKey] = it.split('-')
        const leftCave = caves[leftKey] ?? {value: leftKey, connections: new Set()}
        const rightCave = caves[rightKey] ?? {value: rightKey, connections: new Set()}

        leftCave.connections.add(rightCave)
        rightCave.connections.add(leftCave)
        caves[leftKey] = leftCave
        caves[rightKey] = rightCave
    })

    return caves
}

function getPathsToEnd(from: Cave, visited: Set<Cave>, paths: string[][], hasUsedSmallCaveException = false): string[][] {
    if (isEnd(from)) {
        return paths
    }

    return Array.from(from.connections).map(conn => {
        let newVisited = new Set(visited)
        let newHasUsedSmallCaveException = hasUsedSmallCaveException
        if (isSmallCave(conn)) {
            if (newVisited.has(conn) && newHasUsedSmallCaveException) {
                return []
            } else if (newVisited.has(conn) && !newHasUsedSmallCaveException) {
                newHasUsedSmallCaveException = true
            }
        } else if (newVisited.has(conn)) {
            return []
        }

        if (!isLargeCave(conn)) {
            newVisited.add(conn)
        }

        let newPaths = getPathsToEnd(conn, newVisited, paths.map(it => [...it, conn.value]), newHasUsedSmallCaveException).filter(it => it.length > 0)
        return newPaths
    }).reduce((a,b) => a.concat(b))
}

async function main() {
    const input = parseInput(await loadInput())
    const caves = toCaves(input)
    const start = Object.entries(caves).find(([_, it]) => isStart(it))![1]
    const paths = getPathsToEnd(start, new Set([start]), [[start.value]])

    console.log(paths.length)
}

main()
