import { BranchNode, decodeNode } from "@ethereumjs/trie"
// import LineDraw from "./LineDraw"
// import NodeButton from "./NodeButton"
import nodeStyle from "./node-style"
import { handleNodeRender } from "./getNode"
import NodeButton from "./NodeButton"
import { MPT } from "./mpt"
import LineDraw from "./LineDraw"
export type CoorsType = {
    x: number
    y: number

}
type BranchNodeProps = {
    coors: CoorsType
    trieNode: BranchNode
    mpt: MPT
}

export default function BranchNodeDraw({
    coors,
    trieNode,
    mpt
}: BranchNodeProps) {
    const value = trieNode.value()
    const childrenNodes = [...Array(16)].map((_, index) => trieNode.getBranch(index))
    const midPointX = coors.x + (nodeStyle.width as number) / 2
    const offset = (nodeStyle.width as number) * 1.1
    const branchLineHeighFactor = 1.6
    const childNodeHeightFactor = 1.75
    return (
        <>
       <NodeButton
            _key={[]}
            value={value}
            label={"Branch "}
            backgroundColor={"#c4ac80"}
            coors={coors}
       />
       <LineDraw
            startPoint={{
                x: midPointX,
                y: coors.y
            }} endPoint={{
                x: midPointX,
                y: coors.y + (nodeStyle.height as number) * branchLineHeighFactor
            }}
            shouldAdjustPoints={false}
        />
       <LineDraw
            startPoint={{
                x: (midPointX - offset * 8) + (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * branchLineHeighFactor
            }} endPoint={{
                x: (midPointX + offset * 8) - (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * branchLineHeighFactor
            }}
            borderColor="grey.300"
            shouldAdjustPoints={false}
       />
        <LineDraw
            startPoint={{
                x: (midPointX - offset * 8) + (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * branchLineHeighFactor
            }} endPoint={{
                x: (midPointX - offset * 8) + (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * childNodeHeightFactor
            }}
            borderColor="grey.300"
            shouldAdjustPoints={false}
       />
       <LineDraw
            startPoint={{
                x: (midPointX + offset * 8) - (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * branchLineHeighFactor
            }} endPoint={{
                x: (midPointX + offset * 8) - (nodeStyle.width as number) / 2,
                y: coors.y + (nodeStyle.height as number) * childNodeHeightFactor
            }}
            borderColor="grey.300"
            shouldAdjustPoints={false}
       />
        {
            childrenNodes.map((child, index) => {
                const decodedChild = child ? decodeNode(child as Uint8Array) : null
                const nextX = index < 8 ? midPointX - offset * (index + 1) : midPointX + offset * (index % 8)
                const nextY = coors.y + (nodeStyle.height as number) * childNodeHeightFactor
                const nextCoors = {
                    x: nextX,
                    y: nextY
                }
                return handleNodeRender(decodedChild, nextCoors, mpt)
            })
        }
        </>
    )
}
