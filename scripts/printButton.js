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
