import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import nodeStyle from "./node-style";

export type CoorsType = {
    x: number
    y: number
    childOffset?: number
}

type NodeButtonProps = {
    _key: number[]
    value: Uint8Array | string |null
    coors: CoorsType
    label: string
    backgroundColor: string
}
export default function NodeButton({
    _key,
    value,
    coors,
    label,
    backgroundColor
}: NodeButtonProps) {
    const [showValue, setShowValue] = useState(false)
    const buttonText = showValue ? `Value: ${value}`: _key.length ? `Key: ${_key.join(',')}` : ''
    return (
        <Button
            onClick={() => {
                setShowValue(!showValue)
            }}
            style={{
                backgroundColor,
                top: coors.y,
                left: coors.x,
                ...nodeStyle
            }}
        >
                <Tooltip label={buttonText}>
                    {showValue ? 'Value' : label}
                </Tooltip>
        </Button>
    )
}
