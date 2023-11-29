import LineDraw from "./LineDraw"
import NodeButton from "./NodeButton"
import nodeStyle from "./node-style"
export type CoorsType = {
    x: number
    y: number

}
type BranchNodeProps = {
    value: Uint8Array | null
    coors: CoorsType
    nextNodes: CoorsType[]
}

export default function BranchNodeDraw(props: BranchNodeProps) {
    const {nextNodes, ...rest } = props
    return (
        <>
       <NodeButton
            _key={[]}
            {...rest}
            label={"Branch "}
            backgroundColor={"#c4ac80"}
       />
       <LineDraw
            startPoint={{
                x: rest.coors.x + (nodeStyle.width as number) / 2,
                y: rest.coors.y
            }}
            endPoint={{
                x: rest.coors.x + (nodeStyle.width as number) / 2,
                y: rest.coors.y + (nodeStyle.height as number) * 1.75
            }}
            shouldAdjustPoints={false}
            borderColor="grey"

        />
        <LineDraw
            startPoint={{
                x: nextNodes[0].x + (nodeStyle.width as number) / 2,
                y: rest.coors.y + (nodeStyle.height as number) * 1.75
            }}
            endPoint={{
                x: nextNodes[8].x + (nodeStyle.width as number) / 2,
                y: rest.coors.y + (nodeStyle.height as number) * 1.75
            }}
            shouldAdjustPoints={false}
        />
         {
            nextNodes.map((nextNode, index) => {
                return (
                    <LineDraw
                        key={index}
                        startPoint={{
                            x: nextNode.x,
                            y: nextNode.y - (nodeStyle.height as number) * 1.25
                        }}
                        endPoint={{
                            x: nextNode.x,
                            y: nextNode.y
                        }}
                        borderColor="grey"
                    />
                )
            })
        }
        </>
    )
}
