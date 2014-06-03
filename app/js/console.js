//Intercept console.log for analysis
//Relying on the console log for loader/background/popup events appears to be quite wasteful - pay now or PAY later
(function() {
  var log = console.log;
  console.log = function(msg) {
    if (typeof msg == "string") {
      if (msg == "No crawls available.") {
        //idle no work
        adjustModuleStats({'emptyWorkQueue':['add',1]});
      } else if (msg == "triggerError") {
        adjustModuleStats({'errors':['add',1]})
      } else if (msg == "Crawl distributor error: Unauthorized") {
        //401;
        adjustModuleStats({'errors':['add',1]})
      } else if (/Crawl distributor error:/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/Could not download EightyApp/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unable to send results/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1],'droppedPackets':['add',1]})
      } else if (/ajax timeout/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unknown ajax error:/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/^ajax error:/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error: You did not complete this crawl packet in time/.test(msg)) {
        //unknown error
        adjustModuleStats({'droppedPackets':['add',1]});
      } else if (/EightyApp could not/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error getting crawl packet:/.test(msg)) {
        //unknown error
        adjustModuleStats({'errors':['add',1]})
      } else if (msg == "Result body too big to process, sending empty result.") {
        //running
        adjustModuleStats({'rejectedPackets':['add',1]})
      } else if (msg == "Unable to send finished crawl packet, retrying...") {
        //running
        updateModuleStatus('retrying send results');
      } else if (msg == "Sending results...") {
        updateModuleStatus('sending results');
        //running
      } else if (msg == "Finishing crawl packet...") {
        //running
        updateModuleStatus('finishing crawl packet');
        adjustModuleStats({'completedPackets':['add',1]});
      } else if (msg == "Finishing crawl...") {
        //running
        updateModuleStatus('finishing crawl');
        //adjustModuleStats({'completedCrawls':['add',1]});
      } else if (msg == "Doing work...") {
        //running
        updateModuleStatus('running');
      } else if (msg == "Completed crawl packet!") {
        //updateModuleStatus('completedCrawlPacket');
        //jobsComplete++;
      } else if (msg == "Starting crawl packet...") {
        updateModuleStatus('beginCrawlPacket');
        adjustModuleStats({'beginCrawlPacket':['add',1]});
        //jobsBegun++;
      } else if (/Could not connect to crawl distributior/.test(msg)) {
        //finalizeTimeout;
        adjustModuleStats({'errors':['add',1]})
      } else if (/^Crawling: /.test(msg)) {
        //crawlsBegun++;
        adjustModuleStats({'crawledURLS':['add',1]});
      } else if (/^Time taken/.test(msg)) {
          crawlTime=Number(msg.match(/(?:Time taken: )(\d*)(?:, Size:)/)[1]);
          crawlBytes=Number(msg.match(/(?:Size: )(\d*)/)[1]);
          adjustModuleStats({'secondsCrawling':['add',crawlTime],'bytesUsed':['add',crawlBytes]});
      } else if ( /^Datafinit Crawler present/.test(msg) ) {
        // version=Number(msg.match(/Build (\d+)/)[1]);
      }
    }
    log.apply(this, arguments);
  }

})();
