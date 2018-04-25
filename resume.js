function toggle_visibility(id) {
  var listItems = document.getElementsByClassName(`li-${id}-expanded`);
  Array.prototype.map.call(listItems, e => {
    // Starts as '' then gets assigned here
    if (e.style.display == 'list-item'){
      console.log(e.style.display)
      e.style.display = 'none';
    }
    else {
      e.style.display = 'list-item';
    }
  })
}
