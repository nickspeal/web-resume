const DEFAULT_DATA_FILENAME = 'data/resume-.json';
const CLIPPY_DELAY = 15000;
var expandedState = []

window.onhashchange = refreshData;
window.onload = refreshData;

function fetchData(filename) {
  const req = new XMLHttpRequest();
  req.open("GET", filename);
  req.overrideMimeType("application/json");
  req.addEventListener('load', loadContent);
  req.send();
  return req;
}

function refreshData() {
  setTimeout(clippyLoadStart, CLIPPY_DELAY);
  const hash = window.location.hash.substring(1);
  const filename = `data/resume-${hash}.json`;
  const req = fetchData(filename);
  req.addEventListener('error', () => fetchData(DEFAULT_DATA_FILENAME));
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

function toggle_visibility(idx) {
  expandedState[idx] = !expandedState[idx];
  var defaultContent = document.getElementsByClassName(`li-${idx}-default`);
  var expandedContent = document.getElementsByClassName(`li-${idx}-expanded`);
  var carets = document.getElementsByClassName(`caret-${idx}`);

  set_visibility(defaultContent, !expandedState[idx]);
  set_visibility(expandedContent, expandedState[idx]);
  flip_caret(carets, expandedState[idx]);
}

function populateText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function populateSkills(skills) {
  const div = document.getElementById("section-skills");
  div.innerHTML = skills.join('<br>');
}

function populateExperience(experience) {
  const div = document.getElementById("section-experience");
  div.innerHTML = '';

  experience.forEach((job, idx) => {
    let listItems = '';
    listItems = job.itemsDefault.reduce(
      (accumulatingList, nextString) => accumulatingList + `<li class="li-${idx}-default noprint">${nextString}</li>`,
      listItems,
    );

    listItems = (job.itemsExpanded || job.itemsDefault).reduce(
      (accumulatingList, nextString) => accumulatingList + `<li class="li-${idx}-expanded noprint hidden">${nextString}</li>`,
      listItems,
    )

    listItems = (job.itemsPrint || job.itemsDefault).reduce(
      (accumulatingList, nextString) => accumulatingList + `<li class="li-print hidden">${nextString}</li>`,
      listItems,
    )

    const newHTML = `
      <div class="job-title">
        <span class="bold clickable" onClick="toggle_visibility(${idx});">
          <i class="fas fa-caret-down caret-${idx}"></i>
          ${job.title}
        </span>
        <span title="${job.dateAlt || ''}">${job.date || ''}</span>
      </div>
      <ul class="job-list">
        ${listItems}
      </ul>
    `
    div.innerHTML += newHTML;
  })
}

function updatePrintButton() {
  // Check if PDF exists on the server:
  const hash = window.location.hash.substring(1);
  const filename = `export/resume-${hash}.pdf`;
  const req = new XMLHttpRequest();
  req.open("HEAD", filename);
  req.addEventListener('load', e => onPDFCheckSuccess(e, filename));
  req.addEventListener('error', onPDFCheckError);
  req.send();
}

function onPDFCheckSuccess(e, filename) {
  const a = document.getElementById('pdf-link');
  if (e.target.status === 200) {
    a.href = filename;
    a.removeAttribute('onClick');
  } else {
    onPDFCheckError();
  }
}

function onPDFCheckError() {
  const a = document.getElementById('pdf-link');
  a.removeAttribute('href');
  a.onClick = window.print;
}


function loadContent(event) {
  // Previously used this.responseText, but it was more opaque about where it was coming from
  if (event && event.target && event.target.status == 200 && event.target.response) {
    var resumeData = JSON.parse(event.target.response);
    populateText('section-warning', resumeData.warning || '');
    populateText('section-summary', resumeData.summary || '');
    populateSkills(resumeData.skills);
    populateExperience(resumeData.experience);
    updatePrintButton();
  } else {
    console.log("Error loading content. Load Event is: ", event);
    console.log("Falling back to default content");
    // BEWARE OF INFINITE LOOP!!
    fetchData(DEFAULT_DATA_FILENAME);
  }
}

function clippyLoadStart() {
  clippy.load('Clippy', clippyLoadComplete);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clippyLoadComplete(agent) {
  // Window coordinates for interactions
  // Origin in the top left.
  const contentExpandVantage = { x: window.innerWidth < 1100 ? 10 : 0.25 * (window.innerWidth - 800), y: 350 };
  const contentExpandTarget = { x: 9999, y: contentExpandVantage.y} // Always point right

  agent.show();
  agent.moveTo(contentExpandVantage.x, contentExpandVantage.y);
  agent.speak("Hello there! Did you know that you can click the section headers to see more detail? Give it a try!");
  agent.gestureAt(contentExpandTarget.x, contentExpandTarget.y);
  await sleep(8000);
  agent.play('Lookleft');
  toggle_visibility(1);
  await sleep(2000);
  agent.speak("Give Nick a call. He'd be great for the job!");
  agent.play("SendMail");
  await sleep(5000);
  agent.hide();
}
