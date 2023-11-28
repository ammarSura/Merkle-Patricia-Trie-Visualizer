import { useMemo } from "react"
import { MPT } from "./mpt"
import getNodes from "./getNode"

type DrawTrieProps = {
    rootKey: Uint8Array | undefined
    mpt: MPT
    shouldReDrawTrie?: boolean
    setShouldReDrawTrie?: (shouldReDrawTrie: boolean) => void
}

export default function DrawTrie({ mpt, rootKey, shouldReDrawTrie }: DrawTrieProps) {
    const START_POINT = {
        x: window.innerWidth / 2,
        y: 100
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const elementsToBeDrawn: React.ReactNode[] | undefined = useMemo(() => getNodes(mpt, rootKey, START_POINT), [mpt, rootKey, START_POINT, shouldReDrawTrie])
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
