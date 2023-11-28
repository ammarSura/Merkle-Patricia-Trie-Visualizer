import LineDraw from "./LineDraw"
import NodeButton from "./NodeButton"
export type CoorsType = {
    x: number
    y: number

}
type BranchNodeProps = {
    value: Uint8Array | null
    coors: CoorsType
    nextNodes: CoorsType[]
}

export default function Draw(props: BranchNodeProps) {
    const {nextNodes, ...rest } = props
    return (
        <>
       <NodeButton
            _key={[]}
            {...rest}
            label={"Branch: "}
       />
        {
            nextNodes.map((nextNode, index) => {
                return (
                    <LineDraw
                        key={index}
                        startPoint={rest.coors}
                        endPoint={nextNode}
                    />
                )
            })
        }
        </>
    )
}
