var moduleStats = "";

function loadCachedStats() {
  var datafinitiStats = localStorage['datafinitiStats'];

  // nothing stored? default to empty
  if (datafinitiStats == undefined) {
    datafinitiStats = '';
  }

  var moduleStats = document.getElementById("xdstats");
  moduleStats.innerHTML = datafinitiStats;
}

function saveCachedStats() {
  var moduleStats = document.getElementById("xdstats");
  localStorage["datafinitiStats"] = moduleStats.innerHTML;
}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-50955413-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _paq = _paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);

(function() {
  var u="https://stats.xd7.org/";
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', 4]);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
  g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();


function trackButtonClick(e) {
    _paq.push(['trackEvent', e.target.id, 'clicked']);
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
  };

document.addEventListener('DOMContentLoaded', function() {

  loadCachedStats();
  chrome.extension.getBackgroundPage().renderPopupStats();

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
