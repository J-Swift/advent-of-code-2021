async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type Opens = '(' | '[' | '{' | '<'
type Closes = ')' | ']' | '}' | '>'

type IncompleteResult = {status: 'incomplete', remaining: Opens[]}
type ErrorResult =  { status: 'error', character: Closes }
type Result = IncompleteResult | ErrorResult

function scoreFor(r: ErrorResult): number {
    switch(r.character) {
        case ')': return 3
        case ']': return 57
        case '}': return 1197
        case '>': return 25137
    }
}

function scoreForIncomplete(r: IncompleteResult): number {
    return r.remaining.map(char => {
        switch(char) {
            case '(': return 1
            case '[': return 2
            case '{': return 3
            case '<': return 4
        }
    }).reduce((memo, val) => 5*memo+val, 0)
}

const openChars = ['(', '[', '{', '<']
const closeChars = [')', ']', '}', '>']

function checkSyntax(line: string): Result {
    const expected = [] as Opens[]

    for(let idx=0; idx<line.length; idx++) {
        let char = line[idx]
        if (openChars.includes(char)) {
            expected.push(char as Opens)
        } else if (closeChars.includes(char)) {
            let shouldBe = expected.pop()
            if (shouldBe == null) throw "Nothing found"
            if (closeChars.indexOf(char) != openChars.indexOf(shouldBe)) {
                return {status: 'error', character: char as Closes}
            }
        } else {
            throw `Unknown char [${char}]`
        }
    }

    return {status: 'incomplete', remaining: expected.reverse()}
}

async function main() {
    const lines = parseInput(await loadInput())
    const res = lines
        .map(it => checkSyntax(it))
        .filter(it => it.status == 'incomplete')
        .map(it => scoreForIncomplete(it as IncompleteResult))
        .sort((a,b) => a-b)

    console.debug(res[(res.length-1)/2])
}

main()
