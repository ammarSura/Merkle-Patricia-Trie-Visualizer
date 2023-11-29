import LineDraw from "./LineDraw"
import NodeButton from "./NodeButton"
import nodeStyle from "./node-style"

export type CoorsType = {
    x: number
    y: number

}
type ExtensionNodeProps = {
    _key: number[]
    value: Uint8Array
    coors: CoorsType
    nextNode: CoorsType
}

export default function ExtensionNodeDraw(props: ExtensionNodeProps) {
    const {nextNode, ...rest } = props
    return (
        <>
        <NodeButton
            {...rest}
            label={"Extension: "}
            backgroundColor={"#74a1db"}
            />
            {
                nextNode && (
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
                )
            }

       </>
    )
}
