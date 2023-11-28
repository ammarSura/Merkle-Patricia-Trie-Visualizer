import { CoorsType } from "./ExtensionNodeDraw"
import nodeStyle from "./node-style"

type LineDrawProps = {
    startPoint: CoorsType
    endPoint: CoorsType
}

export default function LineDraw({
    startPoint,
    endPoint
}: LineDrawProps) {
    const nodeWidth = nodeStyle.width as number
    const nodeHeight = nodeStyle.height as number
    const adjustedStartPoint = {
        x: startPoint.x + (nodeWidth / 2),
        y: startPoint.y + (nodeHeight)
    }
    const adjustedEndPoint = {
        x: endPoint.x + (nodeWidth / 2),
        y: endPoint.y
    }
    return (
        <div
            style={{
                position: 'absolute',
                top: adjustedStartPoint.y,
                left: adjustedStartPoint.x,
                width: 0,
                height: getDistance(adjustedStartPoint, adjustedEndPoint),
                border: '0.5px solid grey',
                transform: `rotate(${getAngle(adjustedStartPoint, adjustedEndPoint) + 270}deg)`,
                transformOrigin: '0% 0%',
                zIndex: -1
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

