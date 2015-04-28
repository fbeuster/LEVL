levl.converter = {
  attributesToString: function(tree) {
    var attr = '';
    switch(tree.nodeName) {
      case 'A':
        for(var i = 0; i < tree.attributes.length; i++) {
          if(tree.attributes[i].name.toLowerCase() === 'href')
            return '=' + tree.attributes[i].value;
        }
        return '';
      default:
        return '';
    }
  },

  domTreeToString: function(tree, last) {
    switch(tree.nodeName) {
      case '#text': return tree.nodeValue;
      case 'BR':    return last !== true ? '[br/]' : '';
      default:      break;
    }

    var html      = '',
        tag       = levl.converter.nodeToTagString(tree),
        num_elems = tree.childNodes.length,
        attr      = levl.converter.attributesToString(tree);

    for(var i = 0; i < num_elems; i++) {
      html += levl.converter.domTreeToString(tree.childNodes[i], i == num_elems - 1);
    }

    if(html === '')                   return '';
    if(levl.converter.nodeIsRoot(tree))  return html;
    return '[' + tag + attr + ']' + html + '[/' + tag + ']';
  },

  htmlToBb: function() {
    var raw = levl.editor.$input.html();

    levl.editor.$hiddenDom.html(raw);

    var tree    = levl.editor.$hiddenDom[0],
        edited  = levl.converter.domTreeToString(tree);

    levl.editor.$preview.text(edited);
  },

  nodeIsDelete: function(nodeName) {
    return nodeName === 'strike';
  },

  nodeIsLink: function(nodeName) {
    return nodeName === 'a';
  },

  nodeIsMark: function(node) {
    if(node.nodeName.toLowerCase() !== 'span')            return false;
    if(node.style.backgroundColor === 'rgb(255, 255, 0)') return true;
    return false;
  },

  nodeIsRoot: function(tree) {
    return tree.className === levl.editor.$hiddenDom.attr('class');
  },

  nodeToTagString: function(node) {
    var nodeName = node.nodeName.toLowerCase();

    if(levl.converter.nodeIsDelete(nodeName)) return 'del';
    if(levl.converter.nodeIsLink(nodeName))   return 'url';
    if(levl.converter.nodeIsMark(node))       return 'mark';

    return nodeName;
  }
};