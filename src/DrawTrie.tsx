import { MPT } from "./mpt"
import { handleNodeRender } from "./getNode"
import { CoorsType } from "./ExtensionNodeDraw"

type DrawTrieProps = {
    rootKey: Uint8Array | undefined
    mpt: MPT
    shouldReDrawTrie?: boolean
    setShouldReDrawTrie?: (shouldReDrawTrie: boolean) => void
    startPoint: CoorsType
}

export default function DrawTrie({ mpt, rootKey, startPoint }: DrawTrieProps) {
    if(!rootKey) {
        return null
    }
    const currentRootNode = mpt.getDecodedNodeFromDb(rootKey);
    return handleNodeRender(currentRootNode, startPoint, mpt);
}
