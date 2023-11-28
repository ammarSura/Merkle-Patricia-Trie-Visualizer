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
    return (
        <Stack align='center'>
            <Heading size='sm'>
                Key Value Pairs
            </Heading>
        <TableContainer
            width='100%'
            maxWidth='100%'
        >
            <Table
                variant='striped'
                size='sm'
            >
                <Thead>
                    <Tr>
                        <Th>Key (Nibbles)</Th>
                        <Th>Key (String)</Th>
                        <Th>Value</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        keyValuePairs.map((keyValuePair, index) => (
                            <Tr key={index}>
                                <Td>{bytesToNibbles(utf8ToBytes(keyValuePair.key))}</Td>
                                <Td>{keyValuePair.key}</Td>
                                <Td>{keyValuePair.value}</Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </Stack>

    )
}
