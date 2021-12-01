#!/usr/bin/env nix-shell
#!nix-shell -p bash -i bash deno

set -euo pipefail

readonly day="${1:-}"
readonly part="${2:-}"

if [ -z "${day}" ] || [ -z "${part}" ]; then
    echo "ERROR: day or part not provided"
    echo
    echo "USAGE: ${0} [day #] [part #]"
    exit 1
fi

main() {
    pushd "day_${day}/part_${part}" >/dev/null
    deno run --allow-read run_it.ts
    popd >/dev/null
}

main
