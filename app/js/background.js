var pluginStatus = 'loading';

function updatePluginStatus(msg) {
  pluginStatus=msg;
  var views = chrome.extension.getViews({type: "popup"});
  for (var i = 0; i < views.length; i++) {
    views[i].document.getElementById('pluginStatus').innerText=pluginStatus;
  }
}

function start_plugin() {
if (pluginStatus=='running'||crawler.getActive==true) {return true;};
updatePluginStatus('starting');
// check for update every update interval
//checkCrawlerUpdateInterval = setInterval(check_crawler_update, updateInterval);
//getCrawlerTimeout=crawlerTimeout || null;

// start loading the crawler
if (version==0) { check_crawler_update(); }
crawler.toggle_active(true);
chrome.browserAction.setBadgeBackgroundColor({ color:[ 0,255,0,255]});
chrome.browserAction.setBadgeText({text: "="});
}

function stop_plugin() {
updatePluginStatus('stopping');
// Clear timers
//clearInterval(checkCrawlerUpdateInterval);
//clearInterval(getCrawlerTimeout);
//checkCrawlerUpdateInterval=null;
//getCrawlerTimeout=null;
crawler.toggle_active(false);
updatePluginStatus('stopped');
chrome.browserAction.setBadgeBackgroundColor({ color:[ 255,255,0,255]});
chrome.browserAction.setBadgeText({text: ">"});
}


// default badge empty blue
chrome.browserAction.setBadgeBackgroundColor({ color:[ 0,204,255,255]});
chrome.browserAction.setBadgeText({text: " "});
