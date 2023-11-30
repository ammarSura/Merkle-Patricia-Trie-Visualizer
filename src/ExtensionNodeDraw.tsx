import { ExtensionNode } from "@ethereumjs/trie"
import NodeButton from "./NodeButton"
import { MPT } from "./mpt"
import { handleNodeRender } from "./getNode"

export type CoorsType = {
    x: number
    y: number

}
type ExtensionNodeProps = {
    trieNode: ExtensionNode
    coors: CoorsType
    mpt: MPT
}

export default function ExtensionNodeDraw(props: ExtensionNodeProps) {
    const { trieNode, coors, mpt } = props
    const key = trieNode.key()
    const value = trieNode.value()
    const decodedChild = mpt.getDecodedNodeFromDb(value as Uint8Array)
    return (
        <>
            <NodeButton
                coors={coors}
                _key={key}
                value={value}
                label={"Extension: "}
                backgroundColor={"#74a1db"}
            />
            {
                handleNodeRender(decodedChild, coors, mpt)
            }
       </>
    )
}
