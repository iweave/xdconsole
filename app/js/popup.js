var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-50955413-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

document.addEventListener('DOMContentLoaded', function() {

  loadStatus();

  var buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
  }

  document.querySelector("#startModule").addEventListener("click", function() {
    chrome.extension.getBackgroundPage().start_module();
  });

  document.querySelector("#stopModule").addEventListener("click", function() {
    chrome.extension.getBackgroundPage().stop_module();
  });

});
