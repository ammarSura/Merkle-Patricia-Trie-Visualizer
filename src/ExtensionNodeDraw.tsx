import { ExtensionNode } from "@ethereumjs/trie"
import NodeButton, { CoorsType } from "./NodeButton"
import { MPT } from "./mpt"
import { Link } from "react-router-dom"
import { bytesToHex } from "@ethereumjs/util"
import { ArrowDownIcon } from "@chakra-ui/icons"
import { IconButton } from "@chakra-ui/react"
import nodeStyle from "./node-style"
import LineDraw from "./LineDraw"

type ExtensionNodeProps = {
    trieNode: ExtensionNode
    coors: CoorsType
    mpt: MPT
    drawChildren?: boolean
}

export default function ExtensionNodeDraw({
    trieNode,
    coors,
}: ExtensionNodeProps) {
    const key = trieNode.key()
    const value = trieNode.value()
    const nextNodeHeightFactor = 1.75
    const {
        x,
        y,
    } = coors
    const nextCoors = {
        x: x,
        y: y + ((nodeStyle.height as number) * nextNodeHeightFactor)
    }
    return (
        <>
            <NodeButton
                coors={coors}
                _key={key}
                value={value}
                label={"Extn"}
                backgroundColor={"#74a1db"}
                showEmptyKeyLabel={true}
            />
                        <LineDraw
                startPoint={{
                    x: coors.x,
                    y: coors.y
                }}
                endPoint={{
                    x: coors.x,
                    y: nextCoors.y
                }}
            />

            <Link
                to={{
                    pathname: '/',
                    search: `?nodeDbKey=${bytesToHex(value)}`
                }}>
                <IconButton
                    style={{
                       ...nodeStyle,
                        left: coors.x,
                        top: coors.y + (nodeStyle.height as number) * 1.7,
                    }}
                    bg='#b8b7b4'
                    aria-label="Go to next node"
                    icon={<ArrowDownIcon boxSize={'1.5rem'}/>}
                >
                </IconButton>

            </Link>
        </>
    )
}
