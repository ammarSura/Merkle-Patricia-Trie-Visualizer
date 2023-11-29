import { BranchNode, ExtensionNode, LeafNode, decodeNode } from "@ethereumjs/trie";
import ExtensionNodeDraw, { CoorsType } from "./ExtensionNodeDraw";
import { MPT } from "./mpt";
import LeafNodeDraw from "./LeafNodeDraw";
import BranchNodeDraw from "./BranchNodeDraw";
import NullNodeDraw from "./NullNodeDraw";
import nodeStyle from "./node-style";

export default function getNodes(mpt: MPT, rootKey: Uint8Array | undefined, currCors: CoorsType) {
    if(!rootKey) return;
    const currentRootNode = mpt.getDecodedNodeFromDb(rootKey);
    const nodes: React.ReactNode[] = [];
    if(currentRootNode instanceof LeafNode) {
        nodes.push(
            <LeafNodeDraw
                _key={currentRootNode.key()}
                value={currentRootNode.value()}
                coors={currCors}
            />
        );
    } else if(currentRootNode instanceof ExtensionNode) {
        const nextCoors = {
            x: currCors.x,
            y: currCors.y + 100
        };
        nodes.push(
            <ExtensionNodeDraw
                _key={currentRootNode.key()}
                nextNode={nextCoors}
                coors={currCors}
                value={currentRootNode.value()}
            />,
        );
        const nextNodes = getNodes(mpt, currentRootNode.value(), nextCoors);
        if(nextNodes?.length) {
            nodes.push(...nextNodes);
        }
    } else if(currentRootNode instanceof BranchNode) {
        const nextCoors = [...Array(16)].map((_, index) => {
            const child = currentRootNode.getBranch(index);
            const width = (nodeStyle.width as number) * 1.2;
            const offset = index < 8 ? (9 - (index + 1)) * - width : (16 - (index + 1)) * width;
            const nextCoors = {
                x: currCors.x + offset,
                y: currCors.y + 100
            };
            const decodedChild = child ? decodeNode(child as Uint8Array) : null;
            if(decodedChild instanceof LeafNode) {
                nodes.push(
                    <LeafNodeDraw
                        _key={decodedChild.key()}
                        value={decodedChild.value()}
                        coors={nextCoors}
                    />,
                );
            } else if(decodedChild instanceof ExtensionNode) {
                nodes.push(
                    <ExtensionNodeDraw
                        _key={decodedChild.key()}
                        nextNode={nextCoors}
                        coors={nextCoors}
                        value={decodedChild.value()}
                    />,
                );

                const nextNodes = getNodes(mpt, decodedChild.value(), {
                    x: nextCoors.x,
                    y: nextCoors.y + (nodeStyle.height as number) * 1.75
                });
                if(nextNodes?.length) {
                    nodes.push(...nextNodes);
                }
            } else {
                nodes.push(
                   <NullNodeDraw
                        coors={nextCoors}
                   />
                );
            }
            return nextCoors;
        })
        nodes.push(
            <BranchNodeDraw
                value={currentRootNode.value()}
                coors={currCors}
                nextNodes={nextCoors}
            />,
        );
    }

    return nodes;
}
