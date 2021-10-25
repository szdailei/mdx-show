/* eslint-disable no-param-reassign */
import { getParams, getTagName } from './parse-jsx-utils';

function createRoot() {
  return {
    tagName: null,
    curent: null,
    parent: null,
    nodeList: [],
    children: [],
  };
}

function createNode(text) {
  const node = createRoot();
  node.tagName = getTagName(text);
  node.params = getParams(text);
  return node;
}

function getCurrentNode(root) {
  if (root.current) {
    return root.current;
  }
  return root;
}

function addNodeToNodeList(root, node) {
  const current = getCurrentNode(root);
  node.parent = current;
  current.nodeList.push(node);
  root.current = node;
}

function addComponentToChildren(root, node, component) {
  node.component = component;
  if (node.parent) node.parent.children.push(component);

  if (node.parent && node.parent.parent) {
    root.current = node.parent;
  } else {
    root.current = null;
  }
}

export { createNode, addNodeToNodeList, addComponentToChildren, getCurrentNode };
