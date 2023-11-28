import { utf8ToBytes } from "ethereum-cryptography/utils";
import { MPT } from ".";
import { Nibbles } from "@ethereumjs/trie";
import { areNibblesEqual, bytesToNibbles, getKeyValuePairInBytes } from "./utils";

tester("inserting first item", () => {
    const mpt = new MPT();
    const [key, value] = getKeyValuePairInBytes("hello", "world");
    mpt.put(key, value);
    const foundItem = mpt.get(key);
    testIfItemIsCorrect(foundItem, value, bytesToNibbles(key));
});

tester('inserting two items with no common prefix', () => {
    const mpt = new MPT();
    const [key1, value1] = getKeyValuePairInBytes("xyz", "world");
    const [key2, value2] = getKeyValuePairInBytes("foo", "bar");
    console.dir({
        key1: bytesToNibbles(key1),
        key2: bytesToNibbles(key2)
    })
    mpt.put(key1, value1);
    mpt.put(key2, value2);

    const foundItem1 = mpt.get(key1);
    testIfItemIsCorrect(foundItem1, value1, bytesToNibbles(key1));

    const foundItem2 = mpt.get(key2);
    testIfItemIsCorrect(foundItem2, value2, bytesToNibbles(key2));
})

tester('inserting two items with common prefix', () => {
    const mpt = new MPT();
    const [key1, value1] = getKeyValuePairInBytes("foox", "world");
    const [key2, value2] = getKeyValuePairInBytes("foo", "bar");
    mpt.put(key1, value1);
    mpt.put(key2, value2);

    const foundItem1 = mpt.get(key1);
    testIfItemIsCorrect(foundItem1, value1, bytesToNibbles(key1));

    const foundItem2 = mpt.get(key2);
    testIfItemIsCorrect(foundItem2, value2, bytesToNibbles(key2));
})

tester('inserting two items with common prefix and one with no common prefix', () => {
    const mpt = new MPT();
    const [key1, value1] = getKeyValuePairInBytes("xyz", "world");
    const [key2, value2] = getKeyValuePairInBytes("abc", "bar");
    const [key3, value3] = getKeyValuePairInBytes("abc1", "random");
    console.dir({
        key1: bytesToNibbles(key1),
        key2: bytesToNibbles(key2),
        key3: bytesToNibbles(key3)
    })
    mpt.put(key1, value1);
    mpt.put(key2, value2);
    mpt.put(key3, value3);

    const foundItem1 = mpt.get(key1);
    testIfItemIsCorrect(foundItem1, value1, bytesToNibbles(key1));

    const foundItem2 = mpt.get(key2);
    testIfItemIsCorrect(foundItem2, value2, bytesToNibbles(key2));

    const foundItem3 = mpt.get(key3);
    testIfItemIsCorrect(foundItem3, value3, bytesToNibbles(key3));
})

tester('complex test case', () => {
    const mpt = new MPT();
    const keyValuePairs = [
        ["foo", "bar"],
        ["foo1", "bar1"],
        ["foo2", "bar2"],
        ["foo9", "bar3"],
        ["footqwe", "bar12"],
        ["fox", "123sx"],
        ["xas", "asdasdasd"],
        ["asdasdasd", "12"],
        ["xyz", "123"]
    ]

    keyValuePairs.forEach(([key, value]) => {
        console.log(`Inserting ${bytesToNibbles(utf8ToBytes(key))} => ${value}`)
        keyValuePairTest(mpt, key, value)
    })
})

tester('failing test case', () => {
    const mpt = new MPT();
    const keyValuePairs = [
        ["a", "bar"],
        ["x", "bar1"],
        ["n", "bar2"],
    ]

    keyValuePairs.forEach(([key, value]) => {
        console.log(`Inserting ${bytesToNibbles(utf8ToBytes(key))} => ${value}`)
        keyValuePairTest(mpt, key, value)
    })
})


function tester(title: string, func: () => void) {
    try {
        func();
        console.log(`✅ ${title}`);
    } catch (e) {
        console.log(`❌ ${title}`);
        console.log(e);
    }
}
function testIfItemIsCorrect(item: {
    key: Nibbles;
    value: Uint8Array | null;
} | null, value: Uint8Array, searchKey: Nibbles) {
    if (item === null) {
        throw new Error(`Item not found. key: ${searchKey}`);
    }

    if(!item?.value) {
        throw new Error(`Item invalid. key: ${searchKey}`);
    }

    checkIfUintArraysAreEqual(item.value, value)
}

function keyValuePairTest(mpt: MPT, key: string, value: string) {
    const [keyInBytes, valueInBytes] = getKeyValuePairInBytes(key, value);
    mpt.put(keyInBytes, valueInBytes);
    const foundItem = mpt.get(keyInBytes);
    testIfItemIsCorrect(foundItem, valueInBytes, bytesToNibbles(keyInBytes));
}

function checkIfUintArraysAreEqual(value1: Uint8Array, value2: Uint8Array) {
    const value1String = bytesToNibbles(value1)
    const value2String = bytesToNibbles(value2)
    if(areNibblesEqual(value1String, value2String)) {
        return true
    } else {
        throw new Error("Uint8Arrays are not equal")
    }
}
