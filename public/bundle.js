(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const DEFAULT_DATA_FILENAME = 'data/resume-.json';

function refreshData(hashId, onSuccess) {
  console.log("api refresh data called");
  const filename = `data/resume-${hashId}.json`;
  const onError =  (_) => fetchData(DEFAULT_DATA_FILENAME, onSuccess, logErrorFetchingDefault);
  fetchData(filename, onSuccess, onError);
}

function fetchData(filename, onSuccess, onError) {
  const req = new XMLHttpRequest();
  req.open("GET", filename);
  req.overrideMimeType("application/json");
  req.addEventListener('load', event => loadContent(event, onSuccess, onError));
  req.addEventListener('error', onError);
  req.send();
}

function loadContent(event, onSuccess, onError) {
  if (event && event.target && event.target.status == 200 && event.target.response) {
    onSuccess(JSON.parse(event.target.response))
  } else {
    console.error("Error loading content. Load Event is: ", event);
    onError(event);
  }
}

function logErrorFetchingDefault(event) {
  console.error("Error fetching default content: ", event);
}

module.exports = { refreshData };

/*
Load data algorithm:

Try filename
  If success, call parent success function
  if not, try default filename
    if success, call parent success function
    if not, give up
Success is defined as 'load' event fired (not 'error') AND status is 200
*/

},{}],2:[function(require,module,exports){
const CLIPPY_DELAY = 15000;

function clippyLoadStart() {
  setTimeout(() => clippy.load('Clippy', clippyLoadComplete), CLIPPY_DELAY);
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
  // toggle_visibility(1);
  await sleep(2000);
  agent.speak("Give Nick a call. He'd be great for the job!");
  agent.play("SendMail");
  await sleep(5000);
  agent.hide();
}

module.exports = { clippyLoadStart };

},{}],3:[function(require,module,exports){
function populateContent(data) {
  eraseContent('container');
  if (data.coverletter) {
    populateCoverLetter(data.coverletter);
  }
  populateResume(data);
}

function eraseContent(id) {
  document.getElementById(id).innerHTML = '';
}

function populatePage(markup) {
  const page = `
    <div class="page">
      <div class="inner-page">
        <div class="header">
            <h1 class="title">
              Nick Speal
            </h1>
            <div>
               <img src="assets/contact.png" title="Contact info is included as an image to avoid being scraped by web-crawlers"/>
            </div>
        </div>
        <hr />
        ${markup}
      </div>
    </div>
  `
  const container = document.getElementById('container');
  container.innerHTML += page;
}

function populateCoverLetter(content) {
  let markup = '';
  markup += `<br><br>`;
  markup += content.date ? `<p>${content.date}</p><br>` : `<br><br>`
  markup += `<p>${content.salutation}</p>`
  markup += content.body.reduce((markup, item) => markup + `<p>${item}</p>`);
  markup += `<p>${content.closing}</p><p>Nick Speal</p>`;
  populatePage(markup);
}

function populateResume(resumeData) {
  let markup = '';
  markup += summary(resumeData.summary);
  markup += icons(resumeData.skills);
  markup += experience(resumeData.experience);
  if (resumeData.warning) {
    markup += warning(resumeData.warning);
  }
  populatePage(markup);
}

function summary(content) {
  return `<div class="section-summary">${content}</div>`;
}

function icons(skills) {
  return `
    <div class="section-icons">
      <div class="subsection-icons">
        <i class="fas fa-graduation-cap fa-3x icon" title="Education"></i>
        <div class="school-description">
          <span class="bold">McGill University</span><br />
          Bachelor of Mechanical Engineering<br />
          Dean’s Honour List<br />
          GPA: 3.9/4.0
        </div>
      </div>
      <div class="subsection-icons">
        <i class="fas fa-wrench fa-3x icon" title="Skills"></i>
       <div>
         ${skills.join('<br>')}
       </div>
      </div>
    </div>
  `;
}

function experience(content) {
  let markup = '';

  content.forEach((job, idx) => {
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
        <span class="bold clickable" onClick="toggle_visibility(${idx})">
          <i class="fas fa-caret-down caret-${idx}"></i>
          ${job.title}
        </span>
        <span title="${job.dateAlt || ''}">${job.date || ''}</span>
      </div>
      <ul class="job-list">
        ${listItems}
      </ul>
    `
    markup += newHTML;
  })

  return `<div class-"section-experience">${markup}</div>`;
}

function warning(content) {
  return `<div class="section-warning">${content}</div>`
}

module.exports = { populateContent };

},{}],4:[function(require,module,exports){
function updatePrintButton(hashId) {
  // Check if PDF exists on the server:
  const filename = `export/resume-${hashId}.pdf`;
  const req = new XMLHttpRequest();
  req.open("HEAD", filename);
  req.addEventListener('load', e => onPDFCheckSuccess(e, filename));
  req.addEventListener('error', onPDFCheckError);
  req.send();
}

function onPDFCheckSuccess(e, filename) {
  console.log("pdf check success")
  const a = document.getElementById('pdf-link');
  if (e.target.status === 200) {
    a.href = filename;
    a.removeAttribute('onClick');
  } else {
    onPDFCheckError();
  }
}

function onPDFCheckError() {
  console.log('pdf check error')
  const a = document.getElementById('pdf-link');
  a.removeAttribute('href');
  a.onClick = window.print;
}

module.exports = { updatePrintButton };

},{}],5:[function(require,module,exports){
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

},{"./api":1,"./clippy":2,"./markup":3,"./printButton":4}]},{},[5]);
