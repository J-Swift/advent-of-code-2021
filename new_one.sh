#!/usr/bin/env nix-shell
#!nix-shell -p bash -i bash

set -euo pipefail

readonly day="${1:-}"

if [ -z "${day}" ];  then
    echo "ERROR: day not provided"
    echo
    echo "USAGE: ${0} [day #]"
    exit 1
fi

main() {
    local part
    if [ -d "day_${day}/part_01" ]; then
        local part="02"
        cp -r "day_${day}/part_01" "day_${day}/part_02"
    else
        local part="01"
        local -r path="day_${day}/part_01"
        mkdir -p "${path}"
        touch "${path}/input_test.txt"
        touch "${path}/input.txt"
        cat << EOF  > "${path}/run_it.ts"
async function loadInput() {
    return await Deno.readTextFile("./input_test.txt")
}

function parseInput(input: string) {
    return input.split("\n").map(it => +it)
}

async function main() {
    const input = parseInput(await loadInput())
}

main()
EOF
    fi

    code "day_${day}/part_${part}"
}

main
