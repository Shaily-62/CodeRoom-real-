export const buildFileTree = (files = []) => {
  const fileMap = new Map();
  const root = [];

  // Create a node for every file and folder.
  files.forEach((file) => {
    fileMap.set(file.id, {
      ...file,
      children: [],
    });
  });

  // Attach each node to its parent.
  files.forEach((file) => {
    const node = fileMap.get(file.id);

    if (file.parent_id && fileMap.has(file.parent_id)) {
      fileMap.get(file.parent_id).children.push(node);
    } else {
      root.push(node);
    }
  });

  // Sort folders first, then files alphabetically.
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root);

  return root;
};
