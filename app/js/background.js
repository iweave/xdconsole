// default states
var sendAnalytics = true;
var moduleStatus = "initializing";

// Communicate with browser badge/icon
function updateModuleStatus(msg) {
  moduleStatus=msg;
  var views = chrome.extension.getViews({type: "popup"});
  for (var i = 0; i < views.length; i++) {
    Stats.stats.moduleStatus=moduleStatus;
    views[i].document.getElementById('moduleStatus').innerText=moduleStatus;
  }
}

// Render stats for popup page
function renderPopupStats() {
    updateModuleStats(Stats.stats);
}

// Wrap update for incremental changes
function adjustModuleStats(targets) {
  var key, keys, target, entry = {};
  var scratch={};
  keys = Object.keys(targets);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    entry[key]=targets[key];
// Too many ways to send stuff, probably an abstraction pattern I don't know in javascript
    switch(mycase=Object.prototype.toString.call(entry[key])) {
      case '[object Undefined]':
//        console.log('Aborting adjust for '+key+' not defined');
        entry[key] = {
          'method': 'skip',
          'value': false
        };
        break;
      case '[object Number]':
      case '[object String]':
        entry[key]={
          'method':'replace',
          'value':entry[key]
        };
        break;
      case '[object Array]': 
        if (entry[key].length==1) { // [value]
          entry[key]={
            'method':'replace',
            'value':entry[key][0]
          }
        } else if (entry[key].length==2) { // [method,value]
          entry[key]={
            'method':entry[key][0],
            'value':entry[key][1]
          }
        }
        break;
      case '[object Object]':
        if (typeof entry[key].method==='undefined') {
          if (typeof entry[key].value==='string' || typeof entry[key].value==='number') {
            entry[key].method='replace';
          } else {
            entry[key].method='skip';
            entry[key].value=false;
          }
        }
        if (typeof entry[key].value==='undefined') {
          if (entry[key].method=='replace') {
            entry[key].method='skip';
            entry[key].value=false;
          }
        }
        break;
      default:
        console.log('failed to parse adjust request for '+key);
    }
// using updateModuleStats({key : stuff[key]}) interpretes with 'key' as literal inside even though stuff is indexed on variable, so build object to pass
    sendUpdate={};
    sendUpdate[key]=entry[key].value;
    switch(mymethod=entry[key].method) {
      case 'replace':
//        console.log('replace '+key+' with '+entry[key].value);
        updateModuleStats(sendUpdate);
        break;
      case 'add':
      case 'plus':
      case 'increment':
//        console.log('plus '+key+' '+Stats.stats[key]+':'+entry[key].value);
        if (typeof entry[key].value==='number') {
          sendUpdate[key]+=typeof Stats.stats[key]==='number' ? Stats.stats[key] : 0;
          updateModuleStats(sendUpdate);
        } else {
//        console.log('trying to add a string to a number');
        }
        break;
      case 'subtract':
      case 'minus':
      case 'reduce':
      case 'decrement':
//        console.log('subtract '+key+' '+Stats.stats[key]+':'+entry[key].value);
        if (typeof entry[key].value==='number') {
          sendUpdate[key]=typeof Stats.stats[key]==='number' ? Stats.stats[key] - sendUpdate[key] : 0 - sendUpdate[key];
          updateModuleStats(sendUpdate);
        } else {
//        console.log('trying to subtract a string from a number');
        }
        break;
      default:
        console.log('failed to solve adjust for '+key);
    }
//    console.log('mymethod: '+mymethod);
  }
}

function updateModuleStats(targets) {
  var key, keys, target, divData = {};
  var label, divInner, divWrapper = {};
  var views = chrome.extension.getViews({type: "popup"});     
  keys = Object.keys(targets);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
//    console.log("update "+key);
//    console.log("views "+views.length);
    if (views.length > 0) {
//    console.log("found view");
      target = views[0].document.getElementById(key);
//      console.log(''+key+"at: "+target);
      if (target===null) {
//          console.log('no target ' + key + ' found, seeking xdstats');
          divData = document.createElement('div');
          divData.id = key;
          divData.className='dataBox status-update';
          divData.innerText = targets[key];
         
          target = views[0].document.getElementById('xdstats');                     
          if (target === null) { 
//            console.log('no xdstats target found');
          } else {      
//            console.log('appending ' + key + ' to xdstats');
            if(Options.options.labelStats == true) {
//              console.log('label: '+key);
 
              //Let's tile when display is on
              divWrapper = document.createElement('div');
              divWrapper.className='box';
              divInner = document.createElement('div');
              divInner.className='boxInner';
              
              label = document.createElement('label');
              label.className='titleBox';
              label.htmlFor = key;
              label.innerText = key;
              divInner.appendChild(label);
              divInner.appendChild(divData);
              divWrapper.appendChild(divInner);
              target.appendChild(divWrapper);
            } else {
              target.appendChild(div);                                               
            }
          }
      } else {          
          // set stats data
//          console.log("updating existing target "+key);
          target.innerText = targets[key];
          target.classList.toggle('status-update')
      }
    } else {
//      popup not open right now
//      console.log('no views');
    }
    Stats['stats'][key] = targets[key];
    chrome.storage.local.set({'stats': Stats});
  }             
}

function start_module() {
if (moduleStatus=='running'||crawler.getActive==true) {updateModuleStatus('running'); return true;};
updateModuleStatus('starting');

// start loading the crawler
if (version==0) { check_crawler_update(); }
crawler.toggle_active(true);
chrome.browserAction.setBadgeBackgroundColor({ color:[ 0,255,0,255]});
chrome.browserAction.setBadgeText({text: "="});
}

function stop_module() {
updateModuleStatus('stopping');
// Clear timers
//clearInterval(checkCrawlerUpdateInterval);
//clearInterval(getCrawlerTimeout);
//checkCrawlerUpdateInterval=null;
//getCrawlerTimeout=null;
updateModuleStatus('stopping');
crawler.toggle_active(false);
chrome.browserAction.setBadgeBackgroundColor({ color:[ 255,255,0,255]});
chrome.browserAction.setBadgeText({text: ">"});
}


// default badge empty blue on startup
chrome.browserAction.setBadgeBackgroundColor({ color:[ 0,204,255,255]});
chrome.browserAction.setBadgeText({text: " "});

if (sendAnalytics==true) {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-50955413-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}

var Stats = {
  stats: {
    "moduleStatus" : "initializing",
    "completedPackets": 0,
    "acceptedPackets": 0,
    "rejectedPackets": 0,
    "droppedPackets": 0,
    "crawledURLS": 0,
    "bytesUsed": 0,
    "loadedApps": 0,
    "errors": 0,
    "secondsCrawling": 0,
    "secondsIdle": 0
  }
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes['options'] !== 0) {
    chrome.storage.local.get('options', function(options) {
      if(Object.keys(options).length !== 0) {
          Options = options.options;
      } else {
          Options = {};
      }
    });
  } else {
    console.log('onChanged not me!');
  }
});

(function() {
  chrome.storage.local.get('options', function(options) {
    if(Object.keys(options).length !== 0) {
        Options = options.options;
    } else {
        Options = {};
    }
  });
  chrome.storage.local.get('stats', function(stats) {
    if(Object.keys(stats).length === 0) {
      chrome.storage.local.set({
        'stats': Stats
      });
    } else {
        Stats = stats.stats;
    }
    Stats.stats.moduleStatus='stopped';
  });
})();
