import { useMemo } from "react"
import { MPT } from "./mpt"
import getNodes from "./getNode"
import { CoorsType } from "./ExtensionNodeDraw"

type DrawTrieProps = {
    rootKey: Uint8Array | undefined
    mpt: MPT
    shouldReDrawTrie?: boolean
    setShouldReDrawTrie?: (shouldReDrawTrie: boolean) => void
    startPoint: CoorsType
}

export default function DrawTrie({ mpt, rootKey, shouldReDrawTrie, startPoint }: DrawTrieProps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const elementsToBeDrawn: React.ReactNode[] | undefined = useMemo(() => getNodes(mpt, rootKey, startPoint), [mpt, rootKey, startPoint, shouldReDrawTrie])
    return (
        <>
            {
                elementsToBeDrawn?.map((element, index) => (
                    <div key={index}>
                        {element}
                    </div>
                ))
            }
        </>
    )
}
