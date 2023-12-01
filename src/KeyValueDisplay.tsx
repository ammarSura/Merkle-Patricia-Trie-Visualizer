import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading, Stack } from "@chakra-ui/react"
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { bytesToNibbles } from "./mpt/utils";
type KeyValueDisplayPropsType = {
    keyValuePairs: {
        key: string
        value: string
    }[]
}

export default function KeyValueDisplay({ keyValuePairs }: KeyValueDisplayPropsType) {
    if(keyValuePairs.length === 0) return (
        null
    )
    const keyValuePairsSortedByKey = keyValuePairs.sort((a, b) => {
        if(a.key < b.key) return -1
        if(a.key > b.key) return 1
        return 0
    })
    return (
        // todo: fix overflow
        <Stack align='center' overflow={'scroll'}>
            <Heading size='sm'>
                Key Value Pairs
            </Heading>
        <TableContainer
            width='100%'
            maxWidth='100%'
            overflow={'scroll'}
        >
            <Table
                variant='striped'
                size='sm'
            >
                <Thead>
                    <Tr>
                        <Th>Key (Nibbles)</Th>
                        <Th>Value</Th>
                        <Th>Key (String)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        keyValuePairsSortedByKey.map((keyValuePair, index) => (
                            <Tr key={index}>
                                <Td>{bytesToNibbles(utf8ToBytes(keyValuePair.key)).join(',')}</Td>
                                <Td>{keyValuePair.value}</Td>
                                <Td>{keyValuePair.key}</Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </Stack>

    )
}
