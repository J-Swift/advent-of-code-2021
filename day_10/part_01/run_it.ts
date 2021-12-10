async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

type Opens = '(' | '[' | '{' | '<'
type Closes = ')' | ']' | '}' | '>'

type IncompleteResult = {status: 'incomplete'}
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

const openChars = ['(', '[', '{', '<']
const closeChars = [')', ']', '}', '>']

function checkSyntax(line: string): Result {
    const expected = [] as string[]

    for(let idx=0; idx<line.length; idx++) {
        let char = line[idx]
        if (openChars.includes(char)) {
            expected.push(char)
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

    return {status: 'incomplete'}
}

async function main() {
    const lines = parseInput(await loadInput())
    const res = lines
        .map(it => checkSyntax(it))
        .filter(it => it.status == 'error')
        .map(it => scoreFor(it as ErrorResult))
        .reduce((memo, val) => memo+val)

    console.debug(res)
}

main()
