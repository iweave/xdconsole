document.addEventListener('DOMContentLoaded', function() {

  document.querySelector("#startPlugin").addEventListener("click", function() {
    chrome.extension.getBackgroundPage().start_plugin();
  });

  document.querySelector("#stopPlugin").addEventListener("click", function() {
    chrome.extension.getBackgroundPage().stop_plugin();
  });

});
