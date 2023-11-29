**Merkle Patricia Trie Visualizer**
This is a simple react app to visualize Merkle Patricia Tries. It also includes a basic implementation of it in src/mpt. Below is an explanation of an MPT using pseudo code. 
**Merkle Patricia Trie Implementation**

A Merkle Patricia Trie is a mixed data structure which combines the immutability of a Merkle Trie and the compression of a Patricia Trie. It also allows us to have Merkle proofs for any given element if the trie is available to us. It enables us to store key-value pairs efficiently.

It has three types of nodes -

Leaf Nodes - these contain values and a key. Naturally, they do not point to any other nodes as they are leaves.

Extension Nodes - these contain a key and a value. The value is a pointer to the next node.

Branch Nodes - these contain 16 nodes–one for each hex character. Each node is null by default and can be set to point to other nodes.

I found it easier to understand MPT when I figured out the "Patricia" part first and then the "Merkle" part which uses a key-value pair structure to implement the MPT is more complex.

Structurally, it works a lot like Patricia Trie wherein a path is created using segments of the key such that each sequence of key segments is only stored once. It has the following operations -

- **get** (rootNode, searchKey) {

if rootNode is a leaf node {

if rootNode.key == searchKey then return rootNode

Else return null

} else if rootNode is an Extension Node {

if rootNode.key has a matching prefix with searchKey {

searchKey = searchKey with matching prefix removed

return get(rootNode -\> child, searchKey)

} else return null

} else if rootNode is a Branch Node {

var branchChildIndex = searchKey[0]

var childNode = rootNode.getBranch(branchChildIndex)

searchKey = searchKey with the first element removed

get(childNode, searchKey)

} else if rootNode is null then return null

}

- **put** (key, value) {

var targetNode = **get** (key)

targetNode.value = value

}

- **del** (key) {

**put** (key, null)

}

The MPT described above is implemented using a flat key-value database. Each node is either stored directly in the database (where the key is the hash of the serialized value of the node) or it is stored as a child of a Branch node where the branch node stores the node as its serialized value. We now describe the MPT's operations with the flat database using generalized pseudocode -

- global var **db**
  - **get** (key) - gets deserialized value from db
  - **put** (key, node) - puts key-value pair in db (handles serialization of node).
- global var **globalRootKey**
  - Stores the root key of the trie in db
- **mpt**
  - **get** (rootKey, searchKey, pathStack) {

pathStack.addNodeToPath()

//path.addNodeToPath is a general function to add all the traversed nodes

//to the path in the parameter.

var currentRootNode = **db**.get(rootKey)

if currentRootNode is Leaf Node {

return **leafCheck** (currentRootNode, searchKey)

} else if currentRootNode is Extension Node {

var extCheckVal = **extensionCheck** (currentRootNode, searchKey)

if(extCheckVal) {

searchKey = searchKey with matching prefix removed

return **get** (extCheckVal, searchKey)

} else return null

} else if currentRootNode is BranchNode {

var branchCheckVal = **branchCheck** (currentRootNode, searchKey)

if(branchCheckVal is a node) {

return currentRootNode

} else if(branchCheckVal is a key) {

searchKey = searchKey with the first element removed

return **get** (branchCheckVal, searchKey)

} else return null

- **put** (key, value){

var pathStack

result = **get** ( **globalRootKey** , key, pathStack)

if(pathStack.length == 1) {

**handlePointingRootToNode** ( **db**.get(globalRootKey), result)

}

if(result is node) {

result.value = value

} else if (result is null) {

result = LeafNode(key, value)

}

while(pathStack is not empty) {

var currentPathKey = pathStack.pop()

var currentParentNode = **db**.get(currentPathKey)

var updatedNode

if(currentParentNode is BranchNode) {

updatedNode = **handlePointingBranchToNode** (currentParentNode, result)

} else if(currentParentNode is ExtensionNode) {

updatedNode = **handlePointingExtensionToNode** (currentParentNode, result)

}

}

}

- **del** (key) {

**put** (key, null)

}
