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
