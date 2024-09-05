import { Node } from "../NodeEditorScreen"

export const updateNodeField = (prevNodes: Node[], nodeId: string, newValue: string, field: string, branchIndex?: number) => {
    return prevNodes.map((node) => {
        if (node.id === nodeId) {
            if (branchIndex !== undefined) {
                const updatedBranches = node.nodeBranches.map((branch, index) =>
                    index === branchIndex ? {...branch, [field]: newValue} : branch
                );
                return {...node, nodeBranches: updatedBranches};
            } else {
                return {...node, [field]: newValue};
            }
        }
        return node;
    })
};

export const updateNodeId = (prevNodes: Node[], oldNodeId: string, newNodeId: string) => {
        return prevNodes.map((node) =>
            node.id === oldNodeId ? { ...node, id: newNodeId } : node
        )
};

export const deleteBranch = (prevNodes: Node[], nodeId: string, branchIndex: number) => {
    return prevNodes.map((node) => {
            if (node.id === nodeId) {
                const updatedBranches = node.nodeBranches.filter((_, index) => index !== branchIndex);
                return { ...node, nodeBranches: updatedBranches };
            }
            return node;
        })
};

export const deleteNode = (prevNodes: Node[], nodeId: string) => {
    return prevNodes.filter((node) => node.id !== nodeId)
};
