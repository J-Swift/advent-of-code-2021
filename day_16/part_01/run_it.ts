async function loadInput() {
    return await Deno.readTextFile("./input.txt")
}

function parseInput(input: string) {
    return input.split("\n")
}

function toBinaryStr(hexStr: string) {
    return hexStr
        .split('')
        .map(it => parseInt(it, 16).toString(2).padStart(4, '0'))
        .join('')
}

type PacketCommon = {
    version: number,
    typeId: number
}
type LiteralPacket = PacketCommon & {
    payload: { number: number }
}
type SubpacketPacket = PacketCommon & {
    payload: { subpackets: Packet[] }
}
type Packet = LiteralPacket | SubpacketPacket

function isSubpacket(p: Packet): p is SubpacketPacket {
    return (p as SubpacketPacket).payload.subpackets !== undefined
}
function isLiteral(p: Packet): p is LiteralPacket {
    return (p as LiteralPacket).payload.number !== undefined
}

class PacketStreamer {
    constructor(private bits: string){}

    getNext(numBits: number) {
        let res = this.bits.substring(0,numBits)
        this.bits = this.bits.substring(numBits)
        return res
    }

    hasMore() {
        return this.bits.length > 0
    }

    preview() {
        return this.bits
    }
}

function toLiteral(streamer: PacketStreamer) {
    let buffer = ''
    while(true) {
        let leading = streamer.getNext(1)
        buffer += streamer.getNext(4)
        if (leading == '0')
            return parseInt(buffer, 2)
    }
}

function toSubpackets(streamer: PacketStreamer): Packet[] {
    const lengthTypeId = parseInt(streamer.getNext(1), 2)
    let subpackets = []
    switch(lengthTypeId) {
        case 0:
            let lengthOfSubpackets = parseInt(streamer.getNext(15), 2)
            while(lengthOfSubpackets > 0) {
                let [bytesRead, packet] = readPacket(streamer)
                lengthOfSubpackets -= bytesRead
                subpackets.push(packet)
            }
            break
        case 1:
            const numSubpackets = parseInt(streamer.getNext(11), 2)
            for (let i = 0; i < numSubpackets; i++) {
                subpackets.push(readPacket(streamer)[1])
            }
            break
    }
    return subpackets
}

function readPacket(streamer: PacketStreamer): [number, Packet] {
    let startLen = streamer.preview().length

    let version = parseInt(streamer.getNext(3), 2)
    let typeId = parseInt(streamer.getNext(3), 2)

    let payload
    switch(typeId) {
        case 4:
            payload = { number: toLiteral(streamer) }
            break
        default: 
            payload = { subpackets: toSubpackets(streamer) }
            break
    }
    let endLen = streamer.preview().length
    return [startLen - endLen, {
        version, typeId, payload
    } as Packet]
}

function flattenPackets(p: Packet) {
    let res = [{version: p.version}]
    if (isSubpacket(p)) {
        p.payload.subpackets.map(flattenPackets).forEach(it => res = res.concat(it))
    }
    return res 
}

async function main() {
    const input = parseInput(await loadInput())

    let s = new PacketStreamer(toBinaryStr(input[0]))
    let ps = readPacket(s)[1]
    console.log(flattenPackets(ps).map(it => it.version).reduce((a,b) => a+b))
}

main()
