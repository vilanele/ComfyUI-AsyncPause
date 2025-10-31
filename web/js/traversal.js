// Extracted from utils/graphTraversalUtil.ts

function parseExecutionId(executionId) {
	if (!executionId || typeof executionId !== 'string') return null;
	return executionId.split(':').filter((part) => part.length > 0);
}

function getLocalNodeIdFromExecutionId(executionId) {
	const parts = parseExecutionId(executionId);
	return parts ? parts[parts.length - 1] : null;
}

function getSubgraphPathFromExecutionId(executionId) {
	const parts = parseExecutionId(executionId);
	return parts ? parts.slice(0, -1) : [];
}

function traverseSubgraphPath(startGraph, path) {
	let currentGraph = startGraph;
	for (const nodeId of path) {
		const node = currentGraph.getNodeById(nodeId);
		if (!node?.isSubgraphNode?.() || !node.subgraph) return null;
		currentGraph = node.subgraph;
	}
	return currentGraph;
}

function getNodeByExecutionId(rootGraph, executionId) {
	if (!rootGraph) return null;
	const localNodeId = getLocalNodeIdFromExecutionId(executionId);
	if (!localNodeId) return null;
	const subgraphPath = getSubgraphPathFromExecutionId(executionId);
	if (subgraphPath.length === 0) {
		return rootGraph.getNodeById(localNodeId) || null;
	}
	const targetGraph = traverseSubgraphPath(rootGraph, subgraphPath);
	if (!targetGraph) return null;
	return targetGraph.getNodeById(localNodeId) || null;
}

export { getNodeByExecutionId };



