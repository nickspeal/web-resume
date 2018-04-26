function fetchData() {
  var req = new XMLHttpRequest();
  req.open("GET", "resume.json", true);
  req.onreadystatechange = loadContent;
  req.send();
}

window.onload = fetchData;

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

function toggle_visibility(idx) {
  expandedState[idx] = !expandedState[idx];
  var defaultContent = document.getElementsByClassName(`li-${idx}-default`);
  var expandedContent = document.getElementsByClassName(`li-${idx}-expanded`);
  var carets = document.getElementsByClassName(`caret-${idx}`);

  set_visibility(defaultContent, !expandedState[idx]);
  set_visibility(expandedContent, expandedState[idx]);
  flip_caret(carets, expandedState[idx]);
}

function loadContent(r) {
  if (r.originalTarget.readyState === 4){
    var experienceData = JSON.parse(r.originalTarget.response);

    var div = document.getElementById("section-experience");

    experienceData.experience.forEach((job, idx) => {
      var listItems = '';
      listItems = job.itemsDefault.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class="li-${idx}-default noprint">${nextString}</li>`,
        listItems,
      );

      listItems = job.itemsExpanded.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class="li-${idx}-expanded noprint hidden">${nextString}</li>`,
        listItems,
      )

      listItems = job.itemsPrint.reduce(
        (accumulatingList, nextString) => accumulatingList + `<li class="li-print hidden">${nextString}</li>`,
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

function printPDF() {
  window.print();
}
