import { BranchNode, ExtensionNode, LeafNode, Nibbles, decodeNode } from '@ethereumjs/trie'
import DB from './db';
import { areNibblesEqual, bytesToNibbles, getNextStackKey, hash, matchingNibbleLength, setLeafToBranch } from './utils';
import { unprefixedHexToBytes } from '@ethereumjs/util';

type CheckNodeForSearchKeyReturnType = ({ foundNode: null } | { foundNode: LeafNode | ExtensionNode | BranchNode } | { nextNodeDbKey: Uint8Array, nextSearchKey: Nibbles })
export class MPT {
    db: DB
    rootKey: Uint8Array | undefined
    constructor() {
        this.db = new DB();
        this.rootKey = undefined;
    }

    getDecodedNodeFromDb(key: Uint8Array) {
        const rootNode = this.db.get(key)
        if(rootNode === null) {
            return null
        }
        const decodedNode = decodeNode(rootNode)
        return decodedNode
    }

    protected _setItemToDb(node: LeafNode | ExtensionNode | BranchNode) {
        const serializedNode = node.serialize()
        const nodeHash = hash(serializedNode)
        this.db.put(nodeHash, serializedNode)
        return nodeHash
    }
    protected _checkNodeForSearchKey(node: LeafNode | ExtensionNode | BranchNode, searchKey: Nibbles, keyLengths: number[]): CheckNodeForSearchKeyReturnType {
        if(node instanceof LeafNode) {
            const decodedKey = node.key()
            const res = areNibblesEqual(searchKey, decodedKey)
            if(res) {
                return {
                    foundNode: node,
                }
            }
        } else if(node instanceof ExtensionNode) {
            const decodedKey = node.key()
            const matchingNodeKeyPrefixLength = matchingNibbleLength(decodedKey, searchKey)
            if(matchingNodeKeyPrefixLength || decodedKey.length === 0) {
                const nextNodeDbKey = node.value()
                return {
                    nextNodeDbKey,
                    nextSearchKey: searchKey.slice(matchingNodeKeyPrefixLength),
                }
            } else {
                return {
                    foundNode: null,
                }
            }
        } else if(node instanceof BranchNode) {
            if(node.value()) {
                if(areNibblesEqual(searchKey, bytesToNibbles(node.value()!)) || searchKey.length === 0) {
                    return {
                        foundNode: node,
                    }
                }
            }
            const targetKeyBranchIndex = searchKey[0]
            if(targetKeyBranchIndex === undefined) {
                throw new Error('targetKeyBranchIndex is undefined')
            }

            const matchingIndexBranchNode = node.getBranch(targetKeyBranchIndex)
            if(matchingIndexBranchNode === null) {
                return {
                    foundNode: null,
                }
            }
            const decodedMatchingIndexBranchNode = decodeNode(matchingIndexBranchNode as Uint8Array) as ExtensionNode | LeafNode | BranchNode
            return this._checkNodeForSearchKey(decodedMatchingIndexBranchNode, searchKey.slice(1), keyLengths)
        }
        return {
            foundNode: null,
        }
    }
    protected _walkTrie(rootDbKey: Uint8Array, searchNodeKey: Nibbles, walkedDbKeys: (Uint8Array)[], keyLengths: number[]): CheckNodeForSearchKeyReturnType {
        const decodedRootNode = this.getDecodedNodeFromDb(rootDbKey)
        const targetNodeKey = searchNodeKey
        walkedDbKeys.push(rootDbKey)
        keyLengths.push(searchNodeKey.length)

        if(decodedRootNode === null) {
            return {
                foundNode: null,
            }
        }
        const result = this._checkNodeForSearchKey(decodedRootNode, targetNodeKey, keyLengths)
        if('foundNode' in result) {
            return result
        }

        if('nextNodeDbKey' in result) {
            const { nextNodeDbKey, nextSearchKey } = result
            const res = this._walkTrie(nextNodeDbKey, nextSearchKey, walkedDbKeys, keyLengths)
            return res
        }
        return {
            foundNode: null,
        }
    }
    protected _createNewBranchNode(children: (LeafNode | ExtensionNode)[]): BranchNode {
        const newBranchNode = new BranchNode()
        children.forEach(child => {
            const childKey = child.key()
            if(!childKey.length) {
                newBranchNode.value(child.value())
                return
            }
            const childIndex = childKey.shift()
            child.key(childKey)

            if(childIndex === undefined) {
                throw new Error('childIndex is undefined')
            }
            // ensuring that the child's key is truncated by 1 nibble
            // thus the serialised child's key will be 1 nibble shorter
            setLeafToBranch(childIndex, child.serialize(), newBranchNode)
        })

        return newBranchNode
    }

    protected _handleLeafNodeUpdate(node: LeafNode, key: Nibbles, value: Uint8Array): ExtensionNode | BranchNode {
        const targetNodeKey = key.slice()
        const matchingNodeKeyPrefixLength = matchingNibbleLength(node.key(), targetNodeKey)
        if(matchingNodeKeyPrefixLength === 0) {
            return this._createNewBranchNode([
                node,
                new LeafNode(targetNodeKey, value)
            ])

        } else {
            const newBranchNode = this._createNewBranchNode([
                new LeafNode(node.key().slice(matchingNodeKeyPrefixLength), node.value()),
                new LeafNode(targetNodeKey.slice(matchingNodeKeyPrefixLength), value)
            ])
            const newBranchNodeHash = this._setItemToDb(newBranchNode)
            const newExtensionNode = new ExtensionNode(targetNodeKey.slice(0, matchingNodeKeyPrefixLength), newBranchNodeHash)
            return newExtensionNode
        }
    }
    protected _handleExtensionNodeUpdate(node: ExtensionNode, key: Nibbles, value: Uint8Array): ExtensionNode | BranchNode {
        const targetNodeKey = key.slice()
        const matchingNodeKeyPrefixLength = matchingNibbleLength(node.key(), targetNodeKey)
        if(matchingNodeKeyPrefixLength === 0) {
            return this._createNewBranchNode([
                node,
                new LeafNode(targetNodeKey, value)
            ])
        } else {
            if(matchingNibbleLength.length < node.key().length) {
                const newBranchNode = this._createNewBranchNode([
                    new ExtensionNode(node.key().slice(matchingNodeKeyPrefixLength), node.value()),
                    new LeafNode(targetNodeKey.slice(matchingNodeKeyPrefixLength), value)
                ])
                const newBranchNodeHash = this._setItemToDb(newBranchNode)
                const newExtensionNode = new ExtensionNode(targetNodeKey.slice(0, matchingNodeKeyPrefixLength), newBranchNodeHash)
                return newExtensionNode
            } else {
                const nextNode = decodeNode(node.value()) as BranchNode
                // branch node by default because extension nodes can only point to branch nodes
                const result = this._handleNodeUpdate(nextNode, key, value)
                if(result) {
                    this._setItemToDb(result)
                    const newExtensionNode = new ExtensionNode(node.key(), hash(result.serialize()))
                    return newExtensionNode
                }
            }
        }
        throw new Error('not handled case')
    }
    protected _handleBranchNodeUpdate(node: BranchNode, key: Nibbles, value: Uint8Array): ExtensionNode | LeafNode | BranchNode {
        const targetNodeKey = key.slice(0)
        const targetKeyBranchIndex = targetNodeKey[0]
        if(targetKeyBranchIndex === undefined) {
            throw new Error('targetKeyBranchIndex is undefined')
        }

        const matchingIndexRawBranchNode = node.getBranch(targetKeyBranchIndex)

        if(matchingIndexRawBranchNode === null) {
            const nodeIndex = targetNodeKey[0]
            const newLeafNode = new LeafNode(key.slice(1), value)
            setLeafToBranch(nodeIndex, newLeafNode.serialize(), node)
            return node
        } else {
            const matchingIndexBranchNode = decodeNode(matchingIndexRawBranchNode as Uint8Array) as LeafNode | ExtensionNode
            const newNode = this._handleNodeUpdate(matchingIndexBranchNode, key.slice(1), value) as ExtensionNode | BranchNode
            if(newNode instanceof BranchNode) {
                const newNodeHash = this._setItemToDb(newNode)
                const newExtensionNode = new ExtensionNode([], newNodeHash)
                setLeafToBranch(targetKeyBranchIndex, newExtensionNode.serialize(), node)
            } else {
                setLeafToBranch(targetKeyBranchIndex, newNode.serialize(), node)
            }
            return node
        }
    }
    protected _handleNodeUpdate(node: LeafNode | ExtensionNode | BranchNode | null, key: Nibbles, value: Uint8Array): ExtensionNode | BranchNode | LeafNode | null{
        if(node instanceof LeafNode) {
            return this._handleLeafNodeUpdate(node, key, value)
        } else if(node instanceof ExtensionNode) {
            return this._handleExtensionNodeUpdate(node, key, value)
        } else if(node instanceof BranchNode) {
            return this._handleBranchNodeUpdate(node, key, value)
        }

        throw new Error('node is null')
    }

    protected _putRecursively(key: Nibbles, value: Uint8Array, dbKeysPath: Uint8Array[], keyLengths: number[]): Uint8Array | undefined {
        const currentRootDbKey = dbKeysPath.pop()
        let currentKeySuffixLength = keyLengths.pop()
        if(!currentKeySuffixLength) {
            throw new Error('asdsa')
        }
        let currentChildNodeKey = key.slice(-currentKeySuffixLength)
        if(currentRootDbKey === undefined) {
            throw new Error('currentRootDbKey is undefined')
        }
        const currentRootNode = this.getDecodedNodeFromDb(currentRootDbKey as Uint8Array)
        const result = this._handleNodeUpdate(currentRootNode, currentChildNodeKey, value)

        let currentParentNode = this.getDecodedNodeFromDb(currentRootDbKey)
        let currentChildDbKey = currentRootDbKey
        let currentParentDbKey: Uint8Array | undefined = currentRootDbKey
        let currentChildNode = result
        while (currentParentDbKey) {
            currentChildDbKey = currentParentDbKey
            currentParentDbKey = dbKeysPath.pop()
            const oldSuffixKeyLength = currentKeySuffixLength
            currentKeySuffixLength = getNextStackKey(keyLengths)
            currentKeySuffixLength && oldSuffixKeyLength && (currentChildNodeKey = key.slice(-currentKeySuffixLength, -oldSuffixKeyLength))
            if(!currentParentDbKey) {
                this.db.del(currentChildDbKey)
                return this._setItemToDb(currentChildNode!)
            } else {
                currentParentNode = this.getDecodedNodeFromDb(currentParentDbKey)
                if(currentParentNode instanceof ExtensionNode) {
                    this.db.del(currentChildDbKey)
                    if(!currentChildNode) {
                        throw new Error('null child node')
                    }
                    const childNodeHash = this._setItemToDb(currentChildNode)
                    currentParentNode.value(childNodeHash)
                } else if(currentParentNode instanceof BranchNode) {
                    const currentBranchChild = currentParentNode.getBranch(currentChildNodeKey[0])
                    const currentBranchChildDecoded = decodeNode(currentBranchChild as Uint8Array) as ExtensionNode
                    if(!currentChildNode) {
                        throw new Error('null child node')
                    }
                    const childNodeHash = this._setItemToDb(currentChildNode)
                    currentBranchChildDecoded.value(childNodeHash)
                    currentParentNode.setBranch(currentChildNodeKey[0], currentBranchChildDecoded.serialize())
                }
                currentChildNode = currentParentNode
            }
        }
        return
    }

    put(key: Uint8Array, value: Uint8Array) {
        if(this.rootKey === undefined) {
            const leafNode = new LeafNode(bytesToNibbles(key), value)
            this.rootKey = this._setItemToDb(leafNode)
            return this.rootKey
        } else {
            const pathToTarget: Uint8Array[] = []
            const keyLengths: number[] = []
            this._walkTrie(this.rootKey, bytesToNibbles(key), pathToTarget, keyLengths)
            const targetKey = bytesToNibbles(key)

            const result = this._putRecursively(targetKey, value, pathToTarget, keyLengths)
            if(result) {
                this.rootKey = result
            }
        }
    }

    get(key: Uint8Array) {
        if(this.rootKey === undefined) {
            return null
        }
        const rawRootNode = this.db.get(this.rootKey)
        if(rawRootNode === null) {
            return null
        }
        const res = this._walkTrie(this.rootKey, bytesToNibbles(key), [], [])
        if('foundNode' in res && res.foundNode !== null) {
            return {
                key: bytesToNibbles(key),
                value: res.foundNode.value()
            }
        } else {
            return null
        }
    }

    print() {
        console.log('rootKey', this.rootKey)
        for(const [key] of this.db.getEntries()) {
            const decodedNode = this.getDecodedNodeFromDb(unprefixedHexToBytes(key))
            if(decodedNode) {
                console.log(key, decodedNode)
            }
        }
    }
}

