import { CoorsType } from "./NodeButton"
import nodeStyle from "./node-style"

type LineDrawProps = {
    startPoint: CoorsType
    endPoint: CoorsType
    borderColor?: string
    shouldAdjustPoints?: boolean
}

export default function LineDraw({
    startPoint,
    endPoint,
    borderColor,
    shouldAdjustPoints = true
}: LineDrawProps) {
    const nodeWidth = nodeStyle.width as number
    const nodeHeight = nodeStyle.height as number
    const adjustedStartPoint = shouldAdjustPoints ? {
        x: startPoint.x + (nodeWidth / 2),
        y: startPoint.y + (nodeHeight)
    } : startPoint
    const adjustedEndPoint = shouldAdjustPoints ? {
        x: endPoint.x + (nodeWidth / 2),
        y: endPoint.y
    }: endPoint
    return (
        <div
            style={{
                position: 'absolute',
                top: adjustedStartPoint.y,
                left: adjustedStartPoint.x,
                width: 0,
                height: getDistance(adjustedStartPoint, adjustedEndPoint),
                border: '0.5px solid',
                transform: `rotate(${getAngle(adjustedStartPoint, adjustedEndPoint) + 270}deg)`,
                transformOrigin: '0% 0%',
                zIndex: -1,
                borderColor: borderColor || 'grey'
            }}
        >
        </div>
    )
}

function getAngle(startPoint: CoorsType, endPoint: CoorsType) {
    const xDiff = endPoint.x - startPoint.x
    const yDiff = endPoint.y - startPoint.y
    return Math.atan2(yDiff, xDiff) * (180 / Math.PI)
}

function getDistance(startPoint: CoorsType, endPoint: CoorsType) {
    const xDiff = endPoint.x - startPoint.x
    const yDiff = endPoint.y - startPoint.y
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

