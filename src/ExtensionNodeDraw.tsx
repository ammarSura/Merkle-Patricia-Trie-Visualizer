import { ExtensionNode } from "@ethereumjs/trie"
import NodeButton, { CoorsType } from "./NodeButton"
import { MPT } from "./mpt"
import { handleNodeRender } from "./handleNodeRender"
import nodeStyle from "./node-style"
import LineDraw from "./LineDraw"

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
    const nextNodeHeightFactor = 1.75
    const {
        x,
        y,
        childOffset
    } = coors
    const nextCoors = {
        x: x,
        y: y + ((nodeStyle.height as number) * nextNodeHeightFactor) + (childOffset || 0)
    }
    return (
        <>
            <NodeButton
                coors={coors}
                _key={key}
                value={value}
                label={"Extn"}
                backgroundColor={"#74a1db"}
            />
            <LineDraw
                startPoint={{
                    x: coors.x,
                    y: coors.y
                }}
                endPoint={{
                    x: coors.x,
                    y: nextCoors.y
                }}
            />
            {
                handleNodeRender(decodedChild, nextCoors, mpt)
            }
       </>
    )
}
