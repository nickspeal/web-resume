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
