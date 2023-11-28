import LineDraw from "./LineDraw"
import NodeButton from "./NodeButton"

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
            />
        <LineDraw
            startPoint={rest.coors}
            endPoint={nextNode} />
        </>
    )
}
