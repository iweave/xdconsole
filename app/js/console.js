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
        adjustModuleStats({'errors':['add',1]})
      } else if (/Could not download EightyApp/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unable to send results/.test(msg)) {
        updateModuleStatus('retrying send results');
        adjustModuleStats({'errors':['add',1],'retrySendResults':['add',1]})
      } else if (/ajax timeout/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Unknown ajax error:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/^ajax error:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error: You did not complete this crawl packet in time/.test(msg)) {
        adjustModuleStats({'rejectedPackets':['add',1]});
      } else if (/Too many retries, getting new work.../.test(msg)) {
        adjustModuleStats({'droppedPackets':['add',1]});
      } else if (/EightyApp could not/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/Error getting crawl packet:/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (msg == "Result body too big to process, sending empty result.") {
        adjustModuleStats({'rejectedPackets':['add',1]})
      } else if (msg == "Unable to send finished crawl packet, retrying...") {
        adjustModuleStats({'errors':['add',1],'retrySendResults':['add',1]})
        updateModuleStatus('retrying send results');
      } else if (msg == "Sending results...") {
        updateModuleStatus('sending results');
      } else if (msg == "Finishing crawl packet...") {
        updateModuleStatus('finishing crawl packet');
        adjustModuleStats({'acceptedPackets':['add',1]})
      } else if (msg == "Finishing crawl...") {
        updateModuleStatus('finishing crawl');
      } else if (msg == "Doing work...") {
        updateModuleStatus('starting');
      } else if (msg == "Completed crawl packet!") {
        adjustModuleStats({'completedCrawlPacket':['add',1]});
      } else if (msg == "Starting crawl packet...") {
        updateModuleStatus('running');
        adjustModuleStats({'beginCrawlPacket':['add',1]});
      } else if (/Could not connect to crawl distributior/.test(msg)) {
        adjustModuleStats({'errors':['add',1]})
      } else if (/^Crawling: /.test(msg)) {
        adjustModuleStats({'crawledURLS':['add',1]});
      } else if (/^Time taken/.test(msg)) {
          crawlTime=Number(msg.match(/(?:Time taken: )(\d*)(?:, Size:)/)[1]);
          crawlBytes=Number(msg.match(/(?:Size: )(\d*)/)[1]);
          adjustModuleStats({'secondsCrawling':['add',crawlTime],'bytesUsed':['add',crawlBytes]});
      } else if ( /^Datafiniti Crawler present/.test(msg) ) {
          version=Number(msg.match(/Build (\d+)/)[1]);
          adjustModuleStats({'moduleVersion':version});
      }
    }
    log.apply(this, arguments);
  }

})();
