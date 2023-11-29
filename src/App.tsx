import { useRef, useState } from "react";
import { MPT } from "./mpt";
import DrawTrie from "./DrawTrie";
import KeyValueInput from "./KeyValueInput";
import KeyValueDisplay from "./KeyValueDisplay";
import { Button, Heading, Stack } from "@chakra-ui/react";
import { getKeyValuePairInBytes } from "./mpt/utils";
const keyValuePairsInit = [
  {
    key: 'ammar',
    value: '123'
  },
  {
    key: 'pranav',
    value: '456'
  },
  {
    key: 'amar',
    value: '789'
  }
]
function App() {
  const [shouldReDrawTrie, setShouldReDrawTrie] = useState(false)
  const mpt = useRef<MPT | null>(new MPT());
  const [keyValuePairs, setKeyValuePairs] = useState<{
    key: string
    value: string
  }[]>([])

  const generateTestCases = () => {
    mpt.current?.put(...getKeyValuePairInBytes('ammar', '123'))
    mpt.current?.put(...getKeyValuePairInBytes('pranav', '456'))
    mpt.current?.put(...getKeyValuePairInBytes('amar', '789'))
    setKeyValuePairs(keyValuePairsInit)

  }
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
         <Button
            color='white'
            bg={'blue.400'}
            onClick={() => {
              generateTestCases()
              setShouldReDrawTrie(!shouldReDrawTrie)
            }}>
          Generate Test Cases
        </Button>
        <Button
          color='white'
          bg={'red.400'}
          onClick={() => {
            mpt.current = new MPT()
            setKeyValuePairs([])
            setShouldReDrawTrie(!shouldReDrawTrie)
          }}
        >
          Clear
        </Button>
        </Stack>
        </Stack>
      </>
    )

  )
}

export default App
