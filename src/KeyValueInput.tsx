import { Button, Heading, Input, Stack } from '@chakra-ui/react'
import { useState } from 'react'


type KeyValueInputPropsType = {
    handleSubmit: (key: string, value: string) => void
}

export default function KeyValueInput({ handleSubmit }: KeyValueInputPropsType) {
    const [keyValue, setKeyValue] = useState<{
        key: string
        value: string
    }>({
        key: '',
        value: ''
    })
    return (
        <Stack>
            <Heading
                size='sm'
            >
                Add key value pair
            </Heading>
            <Input
                placeholder="Enter key"
                size="sm"
                value={keyValue.key}
                onChange={(e) => setKeyValue({
                    ...keyValue,
                    key: e.target.value
                })}
            />
            <Input
                placeholder="Enter value"
                value={keyValue.value}
                onChange={(e) => setKeyValue({
                    ...keyValue,
                    value: e.target.value
                })}
                size='sm'
            />
            <Button
                onClick={() => {
                    handleSubmit(keyValue.key, keyValue.value)
                    setKeyValue({
                        key: '',
                        value: ''
                    })
                }}
                size='sm'
            >
                Add key value pair
            </Button>
        </Stack>
    )
}
