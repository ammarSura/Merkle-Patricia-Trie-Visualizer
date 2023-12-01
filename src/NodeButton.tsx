import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { MAX_KEY_LENGTH } from "./LeafNodeDraw";
import nodeStyle from "./node-style";

export type CoorsType = {
    x: number
    y: number
    childOffset?: number
}

type NodeButtonProps = {
    _key: number[]
    value: Uint8Array | null
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
    const buttonText = showValue ? `Value: ${value}`: `${label}${_key.join(',')}`
    const truncatedText = buttonText.length > MAX_KEY_LENGTH ? buttonText.slice(0, MAX_KEY_LENGTH) + '...' : buttonText
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
            {
                buttonText.length > MAX_KEY_LENGTH ? <Tooltip label={buttonText}>
                    {truncatedText}
                </Tooltip> : buttonText
            }
        </Button>
    )
}
