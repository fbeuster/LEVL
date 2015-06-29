/**
 * LEVL (https://github.com/fbeuster/levl)
 * Copyright (c) 2015 | Felix Beuster | BSD-2-Clause License
 * All rights reserved.
 */

levl.lib = {
  hasParent: function(node, tag) {
    node = node.parentNode;

    while (node !== null) {
      if (node.nodeName.toLowerCase() === tag) return true;
      node = node.parentNode;
    }

    return false;
  },

  isModernBrowser: function() {
    return window.getSelection;
  }
}