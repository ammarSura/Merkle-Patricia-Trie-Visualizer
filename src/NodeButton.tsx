import { Button, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import nodeStyle from "./node-style";

export type CoorsType = {
    x: number
    y: number
}

type NodeButtonProps = {
    _key: number[]
    value: Uint8Array | string |null
    coors: CoorsType
    label: string
    backgroundColor: string
    showEmptyKeyLabel?: boolean
}
export default function NodeButton({
    _key,
    value,
    coors,
    label,
    backgroundColor,
    showEmptyKeyLabel
}: NodeButtonProps) {
    const [showValue, setShowValue] = useState(false)
    const valueText = `Value: ${value}`
    const keyText = _key.length ? `Key: ${_key.join(',')}` : showEmptyKeyLabel ? 'Key prefix empty at this node' : ''
    const buttonText = showValue ? valueText : keyText
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
