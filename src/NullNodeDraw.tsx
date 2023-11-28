import { Button } from "@chakra-ui/react"
import nodeStyle from "./node-style"

type NullNodeProps = {
    coors: {
        x: number
        y: number
    }
}

export default function NullNodeDraw({
    coors
}: NullNodeProps) {
    return (
        <Button
            style={{
                backgroundColor: "#d6d6d6",
                top: coors.y,
                left: coors.x,
                ...nodeStyle,
            }}
        >
           Null
        </Button>
    )
}
