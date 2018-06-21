const api = require('./api');
const clippy = require('./clippy');
const markup = require('./markup');
const printButton = require('./printButton');

var expandedState = [];
var hashId = '';

window.onhashchange = main;
window.onload = main;

function main() {
  hashId = window.location.hash.substring(1);
  api.refreshData(hashId, onDataFetchSuccess);
}

function onDataFetchSuccess(data) {
  if (data && data.features && !!data.features.clippy) {
    clippy.clippyLoadStart();
  }
  markup.populateContent(data);
  printButton.updatePrintButton(hashId);
}

function init_visibility() {
  // Init to an array with expanded=false for each item.
  expandedState = resumeData.experience.map(_ => false);
}

function set_visibility(items, visibility) {
  Array.prototype.forEach.call(items, e => {
    // Starts as '' then gets assigned here
    if (visibility){
      e.style.display = 'list-item';
    }
    else {
      e.style.display = 'none';
    }
  })
}

function flip_caret(items, flipped) {
  Array.prototype.forEach.call(items, e => {
    // Starts as '' then gets assigned here
    if (flipped){
      e.style.transform = 'rotate(180deg)';
    }
    else {
      e.style.transform = '';
    }
  })
}

// Needs to be on global scope so that it can be called from markup
window.toggle_visibility = (idx) => {
  console.log("toggle_visibility called");
  expandedState[idx] = !expandedState[idx];
  var defaultContent = document.getElementsByClassName(`li-${idx}-default`);
  var expandedContent = document.getElementsByClassName(`li-${idx}-expanded`);
  var carets = document.getElementsByClassName(`caret-${idx}`);

  set_visibility(defaultContent, !expandedState[idx]);
  set_visibility(expandedContent, expandedState[idx]);
  flip_caret(carets, expandedState[idx]);
}
