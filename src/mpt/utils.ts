import { BranchNode, Nibbles } from "@ethereumjs/trie"
import { toBytes, utf8ToBytes } from "@ethereumjs/util"
import { keccak256 } from "ethereum-cryptography/keccak"

export const hash = (data: Uint8Array): Uint8Array => {
    return Uint8Array.from(keccak256(data))
}

export function bytesToNibbles(key: Uint8Array): Nibbles {
    const bkey = toBytes(key)
    const nibbles = [] as Nibbles

    for (let i = 0; i < bkey.length; i++) {
      let q = i * 2
      nibbles[q] = bkey[i] >> 4
      ++q
      nibbles[q] = bkey[i] % 16
    }

    return nibbles
}

export function nibblestoBytes(arr: Nibbles): Uint8Array {
    const buf = new Uint8Array(arr.length / 2)
    for (let i = 0; i < buf.length; i++) {
      let q = i * 2
      buf[i] = (arr[q] << 4) + arr[++q]
    }
    return buf
}

export function addHexPrefix(key: Nibbles, terminator: boolean): Nibbles {
    // odd
    if (key.length % 2) {
      key.unshift(1)
    } else {
      // even
      key.unshift(0)
      key.unshift(0)
    }

    if (terminator) {
      key[0] += 2
    }

    return key
}

export function removeHexPrefix(val: Nibbles): Nibbles {
    if (val[0] % 2) {
      val = val.slice(1)
    } else {
      val = val.slice(2)
    }

    return val
}

export function areNibblesEqual(a: Nibbles, b: Nibbles): boolean {
    if (a.length !== b.length) {
      return false
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false
      }
    }

    return true
}

export function matchingNibbleLength(nib1: Nibbles, nib2: Nibbles): number {
  let i = 0
  while (nib1[i] === nib2[i] && nib1.length > i) {
    i++
  }
  return i
}

export function setLeafToBranch(nodeIndex: number, value: Uint8Array, branchNode: BranchNode) {
  return branchNode.setBranch(nodeIndex, value)
}

export const getNextStackKey = <T>(stack: T[]) => {
  const nextStackKey = stack.pop()
  if(!nextStackKey) {
    return undefined
  }
  return nextStackKey
}

export function getKeyValuePairInBytes(key: string, value: string): [key: Uint8Array, value: Uint8Array] {
  return [utf8ToBytes(key), utf8ToBytes(value)]
}
