/**
 * LEVL (https://github.com/fbeuster/levl)
 * Copyright (c) 2015 | Felix Beuster | BSD-2-Clause License
 * All rights reserved.
 */

var levl = levl || {};

// lib
/**
 * LEVL (https://github.com/fbeuster/levl)
 * Copyright (c) 2015 | Felix Beuster | BSD-2-Clause License
 * All rights reserved.
 */

levl.lib = {
  isModernBrowser: function() {
    return window.getSelection;
  }
}

// converter
/**
 * LEVL (https://github.com/fbeuster/levl)
 * Copyright (c) 2015 | Felix Beuster | BSD-2-Clause License
 * All rights reserved.
 */

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

// editor
/**
 * LEVL (https://github.com/fbeuster/levl)
 * Copyright (c) 2015 | Felix Beuster | BSD-2-Clause License
 * All rights reserved.
 */

levl.editor = {
  $controls   : null,
  $hiddenDom  : null,
  $input      : null,
  $preview    : null,

  init: function() {
    this.assignElements();
    this.bindHandlers();
  },

  bindHandlers: function() {
    this.$controls.find('button').click(this.formatSelection);
    $('.makeBB').click(levl.converter.htmlToBb);
  },

  assignElements: function() {
    this.$controls  = $('#editor .controls');
    this.$hiddenDom = $('.someHidden');
    this.$input     = $('#editor .text');
    this.$preview   = $('.preview');
  },

  formatSelection: function() {
    var role = $(this).attr('data-role'),
        tag;
    switch (role) {
      case 'h2'         : tag = 'h2'; break;
      case 'h3'         : tag = 'h3'; break;
      case 'bold'       : tag = 'b'; break;
      case 'italic'     : tag = 'i'; break;
      case 'underline'  : tag = 'u'; break;
      default: return;
    }

    if(levl.editor.isSingleNode()) {
      var range = levl.editor.getRange();
      levl.editor.wrapNode({
        textNode  : range.startContainer,
        start     : range.startOffset,
        end       : range.endOffset,
        tag       : tag
      });
    } else {
      console.log('multiple nodes...');
    }
  },

  getSelectedText: function() {
    var sel = levl.editor.getSelection();
    if (levl.lib.isModernBrowser()) {
      return sel.toString();
    } else if (document.selection && document.selection.type != 'Control') {
      return sel.text;
    }
  },

  getSelection: function() {
    if (levl.lib.isModernBrowser()) {
      return window.getSelection();
    } else if (document.selection && document.selection.type != 'Control') {
      return document.selection.createRange();
    }
  },

  getRange: function() {
    return levl.editor.getSelection().getRangeAt(0);
  },

  isSingleNode: function() {
    range = levl.editor.getRange();
    return range.startContainer == range.endContainer;
  },

  wrapNode: function(args) {
    var parentNode  = args.textNode.parentNode,
        text        = args.textNode.nodeValue,
        pre         = text.substring(0, args.start),
        selection   = text.substring(args.start, args.end),
        post        = text.substring(args.end, text.length),
        tempNode    = document.createElement('div'),
        openTag     = '<' + args.tag + '>',
        closeTag     = '</' + args.tag + '>';
    tempNode.innerHTML = pre + openTag + selection + closeTag + post;

    while(tempNode.firstChild) {
      parentNode.insertBefore(tempNode.firstChild, args.textNode);
    }
    parentNode.removeChild(args.textNode);
  }
};


$(document).ready(function(){
  levl.editor.init();
});
