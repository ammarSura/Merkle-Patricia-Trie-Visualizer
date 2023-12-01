import { LeafNode } from "@ethereumjs/trie"
import NodeButton from "./NodeButton"
import { bytesToUtf8 } from "ethereum-cryptography/utils"

type LeafNodeProps = {
    trieNode: LeafNode
    coors: {
        x: number
        y: number
    }
}

export const MAX_KEY_LENGTH = 4

export default function LeafNodeDraw({
    trieNode,
    coors
}: LeafNodeProps) {
    const key = trieNode.key()
    const value = trieNode.value()
    return (
        <NodeButton
            coors={coors}
            _key={key}
            value={bytesToUtf8(value)}
            label={"Leaf"}
            backgroundColor={"#74c288"}
        />
    )
}
