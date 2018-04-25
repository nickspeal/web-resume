var expandedState = []
function init_visibility() {
  // Init to an array with expanded=false for each item.
  expandedState = experienceData.experience.map(_ => false);
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

function toggle_visibility(id) {
  expandedState[id] = !expandedState[id];
  var defaultContent = document.getElementsByClassName(`li-${id}-default`);
  var expandedContent = document.getElementsByClassName(`li-${id}-expanded`);
  var carets = document.getElementsByClassName(`caret-${id}`);

  set_visibility(defaultContent, !expandedState[id]);
  set_visibility(expandedContent, expandedState[id]);
  flip_caret(carets, expandedState[id]);
}

function loadContent(r) {
  if (r.originalTarget.readyState === 4){
    var experienceData = JSON.parse(r.originalTarget.response);

    var div = document.getElementById("section-experience");

    experienceData.experience.forEach((job, idx) => {
      var listItems = '';
      listItems = job.itemsDefault.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class=li-${idx}-default>${nextString}</li>`,
        listItems,
      );

      listItems = job.itemsExpanded.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class=li-${idx}-expanded hidden>${nextString}</li>`,
        listItems,
      )

      listItems = job.itemsPrint.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class=li-${idx}-print hidden>${nextString}</li>`,
        listItems,
      )

      var newHTML = `
        <div class="job-title">
          <span class="bold clickable" onClick="toggle_visibility(${idx});">
            <i class="fas fa-caret-down caret-${idx}"></i>
            ${job.title}</span>
          <span>${job.date}</span>
        </div>
        <ul class="job-list">
          ${listItems}
        </ul>
      `
      div.innerHTML += newHTML;
    })
  }
}

function fetchData() {
  var req = new XMLHttpRequest();
  req.open("GET", "resume.json", true);
  req.onreadystatechange = loadContent;
  req.send();
}

window.onload = fetchData;
