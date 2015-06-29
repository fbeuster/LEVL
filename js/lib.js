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