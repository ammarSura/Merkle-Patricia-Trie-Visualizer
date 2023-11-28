import { useEffect, useRef, useState } from "react";
import { MPT } from "./mpt";
import DrawTrie from "./DrawTrie";
import KeyValueInput from "./KeyValueInput";
import KeyValueDisplay from "./KeyValueDisplay";
import { Heading, Stack } from "@chakra-ui/react";
import { getKeyValuePairInBytes } from "./mpt/utils";

function App() {
  const [shouldReDrawTrie, setShouldReDrawTrie] = useState(false)
  const mpt = useRef<MPT | null>(new MPT());
  const [keyValuePairs, setKeyValuePairs] = useState<{
    key: string
    value: string
  }[]>([])
  useEffect(() => {
    setShouldReDrawTrie(true)
    console.log(mpt.current?.rootKey, 'ASD')
  }, [])

  return (
    mpt.current && (
      <>
      <Heading
        textAlign='center'
        size='lg'
      >
        Merkle Patricia Trie
      </Heading>
        <DrawTrie
          rootKey={mpt.current.rootKey}
          mpt={mpt.current}
          shouldReDrawTrie={shouldReDrawTrie}
          setShouldReDrawTrie={setShouldReDrawTrie}
        />
        <Stack
          align='end'
          p='1rem'
        >
        <Stack
          border={'solid grey'}
          width='20%'
          p='0.5rem'
          borderRadius='md'
        >
        <KeyValueInput
          handleSubmit={(key, value) => {
            setKeyValuePairs([...keyValuePairs, {
              key,
              value
            }])
            const keyValuePair = getKeyValuePairInBytes(key, value)
            mpt.current?.put(...keyValuePair)
            setShouldReDrawTrie(!shouldReDrawTrie)
          }}
        />
        <KeyValueDisplay
          keyValuePairs={keyValuePairs}
        />
        </Stack>
        </Stack>
      </>
    )

  )
}

export default App
