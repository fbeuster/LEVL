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
    if (levl.editor.isModernBrowser()) {
      return sel.toString();
    } else if (document.selection && document.selection.type != 'Control') {
      return sel.text;
    }
  },

  getSelection: function() {
    if (levl.editor.isModernBrowser()) {
      return window.getSelection();
    } else if (document.selection && document.selection.type != 'Control') {
      return document.selection.createRange();
    }
  },

  getRange: function() {
    return levl.editor.getSelection().getRangeAt(0);
  },

  isModernBrowser: function() {
    return window.getSelection;
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