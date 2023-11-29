import { useRef, useState } from "react";
import { MPT } from "./mpt";
import DrawTrie from "./DrawTrie";
import KeyValueInput from "./KeyValueInput";
import KeyValueDisplay from "./KeyValueDisplay";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
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
  const containerRef = useRef<HTMLDivElement | null>(null)
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
        position='fixed'
        left='42.5%'
      >
        Merkle Patricia Trie
      </Heading>
      <Box
        border='solid'
        width='150vw'
        overflow={'scroll'}
        ref={containerRef}
      >
        <DrawTrie
          rootKey={mpt.current.rootKey}
          mpt={mpt.current}
          shouldReDrawTrie={shouldReDrawTrie}
          setShouldReDrawTrie={setShouldReDrawTrie}
          startPoint={{
            x: (containerRef.current?.getBoundingClientRect().width || 0)  / 2,
            y: 100
          }}
        />
      </Box>
        <Stack
          width='20%'
          p='0.5rem'
          borderRadius='md'
          position='fixed'
          right='0px'
          bg='white'
          boxShadow='lg'
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
      </>
    )

  )
}

export default App
