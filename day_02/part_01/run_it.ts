async function loadInput() {
    return await Deno.readTextFile("./input.txt");
}

function parseInput(input: string) {
    return input.split("\n").map(it => {
        const parts = it.split(" ");
        const command = parts[0], amount = +parts[1];
        return {command, amount}
    });
}

function runCommands(commands: {command: string, amount: number}[]) {
    let position = 0, depth = 0;
    commands.forEach(it => {
        switch(it.command) {
            case 'forward':
                position += it.amount;
                break
            case 'up':
                depth -= it.amount;
                break
            case 'down':
                depth += it.amount;
                break
        }
    });
    return {position, depth};
}

async function main() {
    const inputs = parseInput(await loadInput())
    const res = runCommands(inputs)
    console.log(`[${res.position}] [${res.depth}] [${res.depth*res.position}]`)
}

main()
