import NodeButton from "./NodeButton"

type LeafNodeProps = {
    _key: number[]
    value: Uint8Array
    coors: {
        x: number
        y: number
    }
}

export const MAX_KEY_LENGTH = 4

export default function LeafNodeDraw(props: LeafNodeProps) {
    return (
        <NodeButton
            {...props}
            label={"Leaf: "}
        />
    )
}
