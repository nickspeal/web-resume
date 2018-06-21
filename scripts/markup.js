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
