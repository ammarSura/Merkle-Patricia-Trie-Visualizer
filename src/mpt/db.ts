import { bytesToUnprefixedHex, unprefixedHexToBytes } from "@ethereumjs/util";

type IDB = { [key: string]: string };

export default class DB {
    _db: IDB
    constructor() {
        this._db = {}
    }

    get(key: Uint8Array) {
        const hexKey = bytesToUnprefixedHex(key)
        const node = this._db[hexKey]
        return node ? unprefixedHexToBytes(node) : null

    }

    put(key: Uint8Array, value: Uint8Array) {
        const hexKey = bytesToUnprefixedHex(key)
        this._db[hexKey] = bytesToUnprefixedHex(value)
    }

    del(key: Uint8Array) {
        const hexKey = bytesToUnprefixedHex(key)
        delete this._db[hexKey]
    }

    print() {
        console.log(this._db)
    }

    getEntries() {
        return Object.entries(this._db)
    }
}
