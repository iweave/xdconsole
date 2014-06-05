// xdmachine plugin for datafiniti

var crawlerUrl = "https://s3.amazonaws.com/crawler.datafinitiapp.net/crawler.js"
var updateUrl = "https://s3.amazonaws.com/crawler.datafinitiapp.net/version.html";

var version = 0;
var affiliate_id = "be13j0y0f8whg0wy9nvn9be1bfugtpvy"

var updateTimeout = 1000*10; // 30 seconds
var updateInterval = 1000*60*60; // 1 hour
var getCrawlerRetryDelay = 1000*30; // 30 seconds

function Crawler() {
  this.paused = true;
};
Crawler.prototype.stop_work = function() {};
//initialize crawler but leave it off for now
var crawler = new Crawler(affiliate_id,false);

// check for update every update interval
var checkCrawlerUpdateInterval = setInterval(check_crawler_update, updateInterval);
var getCrawlerTimeout = null;

function get_crawler() {
  try {
    // load the crawler
    $.getScript(crawlerUrl)
      .fail(function(jqxhr, settings, exception) {
        updatePluginStatus('failLoad');
        clearTimeout(getCrawlerTimeout);
        getCrawlerTimeout = setTimeout(get_crawler, getCrawlerRetryDelay);
    }).done(function() {
        updatePluginStatus('running');
    });
  } catch(err) {
    // try again in 30 seconds
    updatePluginStatus('errorLoad');
    console.log(err);
    clearTimeout(getCrawlerTimeout);
    getCrawlerTimeout = setTimeout(get_crawler, getCrawlerRetryDelay);
  }
}

function check_crawler_update() {
  //console.log("checking for crawler update");
  try {
    // if new version is greater than current version, get_crawler
    var request = $.ajax({
      type: "GET",
      url: updateUrl,
      dataType: "html",
      timeout: updateTimeout,
      cache: false,
      success: function(msg) {
        if(parseInt(msg) > version) {
          updatePluginStatus('upgrade');
          console.log('new version ' + version + ' -> ' + msg);
          // get the new crawler
          crawler.stop_work();
          version = parseInt(msg);
          start_crawler_update(0);
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  } catch(err) {
    // do nothing
    console.log(err);
  }
}

function start_crawler_update(i) {
  if(crawler.paused || i > 60) {
    clearTimeout(getCrawlerTimeout);
    crawler = null;
    getCrawlerTimeout = setTimeout(get_crawler, 1000);
  } else {
    setTimeout(function(){ start_crawler_update(i+1); }, 1000);
  }
}
