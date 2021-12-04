async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type NumberInfo  = {
    value: number
    row: number
    col: number
}

class Board {
    public numbers: number[][]
    public isAWin = false
    public winValue?: number

    private numberLookup: {[key: number]: NumberInfo} = {}
    private markedNumbers = new Set<NumberInfo>()
    private unmarkedNumbers = new Set<NumberInfo>()

    constructor(numbers: number[][]) {
        this.numbers = numbers
        numbers.forEach((row, rowIdx) => {
            row.forEach((num, colIdx) => {
                const numInfo = {value: num, row: rowIdx, col: colIdx}
                this.numberLookup[num] = numInfo
                this.unmarkedNumbers.add(numInfo)
            })
        })
    }

    public mark(num: number) {
        if (this.numberLookup[num] == null) return false

        this.unmarkedNumbers.delete(this.numberLookup[num])
        this.markedNumbers.add(this.numberLookup[num])
        this.isAWin = this.didWin()
        if (this.isAWin && this.winValue == null) {
            this.winValue = this.calculateWinValue(num)
        }
        return this.isAWin
    }

    public toString() {
        return this.numbers.map(it => it.join(", ")).join("\n")
    }

    private calculateWinValue(lastCalled: number) {
        let unmarkedTotal = 0
        this.unmarkedNumbers.forEach(it => unmarkedTotal += it.value)
        return unmarkedTotal * lastCalled
    }

    private didWin() {
        const rowLookup = Array(5)
        const colLookup = Array(5)
        this.markedNumbers.forEach(it => {
            let rowVal = rowLookup[it.row] ?? 0
            let colVal = colLookup[it.col] ?? 0
            rowLookup[it.row] = rowVal + 1
            colLookup[it.col] = colVal + 1
        })
        return rowLookup.includes(5) || colLookup.includes(5)
    }
}

function parseBoards(input: string[]) {
    console.log(input.length)
    let idx=0
    let boards: Board[] = []
    while(idx < input.length) {
        const nums = input.slice(idx, idx+5).map(it => it.trim().split(/\s+/).map(Number))
        const board = new Board(nums)
        boards.push(board)
        idx+=6
    }
    return boards
}

async function main() {
    const input = parseInput(await loadInput())

    const numbersCalled = input[0].split(",").map(Number)
    const boards = parseBoards(input.slice(2))

    let lastWon = null
    numbersCalled.forEach(numberCalled => {
        boards.forEach(board => {
            if (!board.isAWin) {
                if (board.mark(numberCalled)) {
                    lastWon = board
                }
            }
        })
    })
    if (lastWon != null) console.log((lastWon as Board).winValue)
    else console.log("NO WIN")
}

main()
