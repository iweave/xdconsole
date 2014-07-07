//Intercept console.log for analysis
//Relying on the console log for loader/background/popup events appears to be quite wasteful - pay now or PAY later
(function() {
  var log = console.log;
  console.log = function(msg) {
    if (typeof msg == "string") {
      if (msg == "No crawls available.") {
        //idle no work
        _paq.push(['trackEvent','Crawler','NoWork','Idle']);
        adjustModuleStats({'emptyWorkQueue':['add',1]});
      } else if (msg == "triggerError") {
        adjustModuleStats({'errors':['add',1]})
      } else if (msg == "Crawl distributor error: Unauthorized") {
        //401;
        _paq.push(['trackEvent','CrawlError','CrawlDistNoAuth']);
        adjustModuleStats({'errors':['add',1]})
      } else if (/Crawl distributor error:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Could not download EightyApp/.test(msg)) {
        _paq.push(['trackEvent','CrawlError','EightyAppNoPull']);
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unable to send results/.test(msg)) {
        _paq.push(['trackEvent','CrawlError','SendResultsFail']);
        updateModuleStatus('retrying send results');
        adjustModuleStats({'errors':['add',1],'retrySendResults':['add',1]})
      } else if (/ajax timeout/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unknown ajax error:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/^ajax error:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error: You did not complete this crawl packet in time/.test(msg)) {
        _paq.push(['trackEvent','CrawlError','CrawlPacketExpired']);
        adjustModuleStats({'rejectedPackets':['add',1]});
      } else if (/Too many retries, getting new work.../.test(msg)) {
        _paq.push(['trackEvent','CrawlError','CrawlPacketDropped']);
        adjustModuleStats({'droppedPackets':['add',1]});
      } else if (/EightyApp could not/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error getting crawl packet:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (msg == "Result body too big to process, sending empty result.") {
        _paq.push(['trackEvent','CrawlError','CrawlPacketBloated']);
        adjustModuleStats({'rejectedPackets':['add',1]})
      } else if (msg == "Unable to send finished crawl packet, retrying...") {
        _paq.push(['trackEvent','CrawlError','SendResultsFail']);
        adjustModuleStats({'errors':['add',1],'retrySendResults':['add',1]})
        updateModuleStatus('retrying send results');
      } else if (msg == "Sending results...") {
        _paq.push(['trackEvent','CrawlPacket','SendResults']);
        updateModuleStatus('sending results');
      } else if (msg == "Finishing crawl packet...") {
        _paq.push(['trackEvent','CrawlPacket','Checkout']);
        updateModuleStatus('finishing crawl packet');
        adjustModuleStats({'acceptedPackets':['add',1]})
      } else if (msg == "Finishing crawl...") {
        _paq.push(['trackEvent','CrawlPacket','PackCart']);
        updateModuleStatus('finishing crawl');
      } else if (msg == "Doing work...") {
        _paq.push(['trackEvent','CrawlPacket','NewJob']);
        updateModuleStatus('starting');
      } else if (msg == "Completed crawl packet!") {
        _paq.push(['trackEvent','CrawlPacket','Complete']);
        adjustModuleStats({'completedCrawlPacket':['add',1]});
      } else if (msg == "Starting crawl packet...") {
        _paq.push(['trackEvent','CrawlPacket','NewCart']);
        updateModuleStatus('running');
        adjustModuleStats({'beginCrawlPacket':['add',1]});
      } else if (/Could not connect to crawl distributior/.test(msg)) {
        _paq.push(['trackEvent','CrawlError','NoDistributor']);
        adjustModuleStats({'errors':['add',1]})
      } else if (/^Crawling: /.test(msg)) {
        _paq.push(['trackEvent','CrawlPacket','CartAddURL']);
        adjustModuleStats({'crawledURLS':['add',1]});
   // } else if (/^regexForCategories:/.test(msg)) {
   //     parse for 'search' words for grid analytics in piwik
   // 
      } else if (/^Time taken/.test(msg)) {
          crawlTime=Number(msg.match(/(?:Time taken: )(\d*)(?:, Size:)/)[1]);
          crawlBytes=Number(msg.match(/(?:Size: )(\d*)/)[1]);
          //Crawl.['crawlId','depth','maxDepth','maxUrls'] 
          _paq.push(['trackEvent','CrawlPacket','crawlURL']);
          _paq.push(['trackEvent','CrawlTime','Datafiniti','milliseconds',crawlTime]);
          _paq.push(['trackEvent','CrawlBytes','Datafiniti','Transfer',crawlBytes]);
          adjustModuleStats({'secondsCrawling':['add',crawlTime],'bytesUsed':['add',crawlBytes]});
      } else if ( /^Datafiniti Crawler present/.test(msg) ) {
          version=Number(msg.match(/Build (\d+)/)[1]);
          _paq.push(['trackEvent','CrawlVersion',version]);
          adjustModuleStats({'moduleVersion':version});
      }
    }
    log.apply(this, arguments);
  }

})();
