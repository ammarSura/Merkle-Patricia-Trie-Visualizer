import { useEffect, useMemo, useRef, useState } from "react";
import { MPT } from "./mpt";
import DrawTrie from "./DrawTrie";
import KeyValueInput from "./KeyValueInput";
import KeyValueDisplay from "./KeyValueDisplay";
import { Box, Button, Heading, List, Stack, Text } from "@chakra-ui/react";
import { getKeyValuePairInBytes } from "./mpt/utils";
import useAlchemy from "./useAlchemy";
import { TransactionResponse } from "alchemy-sdk";
import { useNavigate, useSearchParams } from "react-router-dom";
import { hexToBytes } from "@ethereumjs/util";
const keyValuePairsInit: KeyValue[] = [
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

type KeyValue = {
  key: string
  value: string
}
function App() {
  const [shouldReDrawTrie, setShouldReDrawTrie] = useState(false)
  const { getBlockTransactions } = useAlchemy()
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const mpt = useRef<MPT | null>(new MPT());
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValue[]>([])
  const [currentRootKey, setCurrentRootKey] = useState<Uint8Array | undefined>()
  const [transactionLoading, setTransactionLoading] = useState(false)
  const accountsKeyValues = useMemo(() => {
    if(!transactions.length) return []
    const accountMap: {[key: string]: boolean} = {}
    return transactions.reduce((accounts, transaction) => {
      if(!transaction.r) return accounts
      if(!accountMap[transaction.r]) {
        const balance = parseInt(transaction.value._hex, 16)
        accounts.push({
          key: transaction.r,
          value: JSON.stringify({
            balance: `${balance / 10 ** 18} eth`
          })
        })
      }
      return accounts
    }, [] as KeyValue[])
  }, [transactions])

  const generateTestCases = () => {
    mpt.current?.put(...getKeyValuePairInBytes('ammar', '123'))
    mpt.current?.put(...getKeyValuePairInBytes('pranav', '456'))
    mpt.current?.put(...getKeyValuePairInBytes('amar', '789'))
    setKeyValuePairs(keyValuePairsInit)
  }
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(searchParams.get('nodeDbKey')) {
      const nodeDbKey = searchParams.get('nodeDbKey') as string
      const nodeDbKeyBytes = hexToBytes(nodeDbKey)
      const nodeFound = mpt.current?.getDecodedNodeFromDb(nodeDbKeyBytes)
      if(nodeFound) {
        setCurrentRootKey(nodeDbKeyBytes)
      } else {
        setSearchParams(undefined)
      }
    } else {
      setCurrentRootKey(mpt.current?.rootKey)
    }
    setShouldReDrawTrie(!shouldReDrawTrie)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setSearchParams])

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
        width='130vw'
        border='solid'
        borderColor='transparent'
        overflow={'scroll'}
        ref={containerRef}
      >
        <DrawTrie
          rootKey={currentRootKey || mpt.current?.rootKey}
          mpt={mpt.current}
          shouldReDrawTrie={shouldReDrawTrie}
          setShouldReDrawTrie={setShouldReDrawTrie}
          startPoint={{
            x: (containerRef.current?.getBoundingClientRect().width || 0) / 2,
            y: 100
          }}
        />
      </Box>
        <Stack
          width='20%'
          p='0.5rem'
          borderRadius='md'
          position='fixed'
          right='1rem'
          top='1rem'
          bg='white'
          boxShadow='lg'
          overflow='scroll'
          maxH={'fit-content'}
        >
          <Box maxH={'10rem'}>
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
        </Box>
        <KeyValueDisplay
          keyValuePairs={keyValuePairs}
        />
         <Button
            color='white'
            bg={'blue.400'}
            onClick={() => {
              generateTestCases()
              setShouldReDrawTrie(!shouldReDrawTrie)
            }}
            size='md'
            minH={'fit-content'}
          >
          Generate Test Cases
        </Button>
        <Button
          bg='yellow.600'
          color='white'
          isDisabled={searchParams.get('nodeDbKey') === null}
          onClick={() => {
            navigate(-1)
          }}>
          Go Back to Previous Node
        </Button>
        <Button
          color='white'
          bg={'red.400'}
          onClick={() => {
            mpt.current = new MPT()
            setCurrentRootKey(undefined)
            setKeyValuePairs([])
            setShouldReDrawTrie(!shouldReDrawTrie)
            navigate('/')
          }}
          minH={'fit-content'}
        >
          Clear
        </Button>
        <Button
          isLoading={transactionLoading}
          onClick={async() => {
          setTransactionLoading(true)
          const blockTransactions = await getBlockTransactions()
          setTransactions(blockTransactions)
          setTransactionLoading(false)
        }}>
          Get Transactions
        </Button>
        {
          transactions.length && (
            <Heading size='sm'>
              Number of Transactions: {transactions.length}
            </Heading>
          )
        }
        <List
          maxH={'15rem'}
          overflow={'scroll'}
        >
          {
            transactions.slice().map((transaction, index) => (
              <Box
                key={index}
                p='0.5rem'
                border='solid'
                borderWidth='1px'
                borderRadius='md'
                mb='0.5rem'
              >
                <Text>
                  <b>Hash:</b>{transaction.hash}
                </Text>
                <Text size='sm'>
                  <b>To:</b> {transaction.r}
                </Text>
                <Text size='sm'>
                  <b>From:</b> {transaction.from}
                </Text>
                <Text size='sm'>
                  <b>Value:</b> {parseInt(transaction.value._hex, 16)}
                </Text>
              </Box>
            ))
          }
        </List>
        {
          accountsKeyValues.length && (
            <Button bg={'green.300'} color={'white'} onClick={() => {
              setKeyValuePairs(accountsKeyValues.slice(0, 10))
              setCurrentRootKey(undefined)
              for(const keyValue of accountsKeyValues) {
                const keyValuePair = getKeyValuePairInBytes(keyValue.key, keyValue.value)
                mpt.current?.put(...keyValuePair)
              }
            }}>
              Build Trie from Transactions
            </Button>
          )
        }
        </Stack>
      </>
    )

  )
}

export default App
