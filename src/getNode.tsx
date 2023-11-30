import { BranchNode, ExtensionNode, LeafNode } from "@ethereumjs/trie";
import ExtensionNodeDraw, { CoorsType } from "./ExtensionNodeDraw";
import { MPT } from "./mpt";
import LeafNodeDraw from "./LeafNodeDraw";
import BranchNodeDraw from "./BranchNodeDraw";
import NullNodeDraw from "./NullNodeDraw";

export function handleNodeRender(node: BranchNode | ExtensionNode | LeafNode | null, coors: CoorsType, mpt: MPT) {
    if(node instanceof LeafNode) {
        return (
            <LeafNodeDraw
                trieNode={node}
                coors={coors}
            />
        )
    } else if(node instanceof ExtensionNode) {
        return (
            <ExtensionNodeDraw
                mpt={mpt}
                trieNode={node}
                coors={coors}
            />
        )
    } else if(node instanceof BranchNode) {
        return (
            <BranchNodeDraw
                trieNode={node}
                coors={coors}
                mpt={mpt}
            />
        )
    } else {
        return (
            <NullNodeDraw
                coors={coors}
            />
        )
    }
}
