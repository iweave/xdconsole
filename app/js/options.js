// Default Settings
var Options = {
    options: {
        "autoStart": false,
        "lastState": false,
        "updateTimeout": 1000*10, // 30 seconds
        "updateInterval": 1000*60*60, // 1 Hour
        "getCrawlerRetryDelay": 1000*30, // 30 seconds
    }
}


var optionsTemplate = {
    options: [{
        name: "autoStart",
        hoverText: "When checked will start crawler if active is true on browser launch",
        description: "Start Crawler when browser starts",
        type: "checkbox"

    }, {
        name: "active",
        hoverText: "Restart Crawler if it is not running",
        description: "Keep Crawler Running",
        type: "checkbox"

    }, {
        name: "updateTimeout",
        hoverText: "Range: [5 minutes] 300000 > updateTimeout > 1000 [1 second]",
        description: "Timeout for Update Crawler (milliseconds)",
        type: "number",
        min: 1000,
        max: 99999
    }, {
        name: "updateInterval",
        hoverText: "Range: [1 week] 604800000 > updateTimeout > 99999 [100 seconds]",
        description: "How long to wait before checking for new crawler version (milliseconds)",
        type: "number",
        min: 1000,
        max: 604800000

    }, {
        name: "getCrawlerRetryDelay",
        hoverText: "Range: [12 hours] 43200000 > updateTimeout > 1000 [1 second]",
        description: "If Update Crawler fails, how long to wait before retrying (milliseconds)",
        type: "number",
        min: 1000,
        max: 432000000

    }]
}

var optionsTemplateSelectors = {
    options: '#options',
}


renderHTML = function(template, targets) {
    var key, keys, elements = {};
    keys = Object.keys(targets);
    for(var i = 0; i < keys.length; i++) {
        key = keys[i];
        elements[key] = document.querySelector(targets[key]);
        if (elements[key]===null) console.debug('Couldn\'t find "'+key+'"" using the querySelector "'+targets[key]+'"');
    }

    var sections = Object.keys(template),
        section;
    var item;
    var option, div, text;
    for(var z = 0; z < sections.length; z++) {
        section = sections[z];
        for(var i = 0; i < template[section].length; i++) {
            item = template[section][i];
            div = document.createElement('div');
            text = document.createTextNode(item.description);
            option = document.createElement('input');
            option.id = item.name + '-' + item.type;
            option.dataset['section'] = section;
            option.dataset['key'] = item.name;
            option.title = item.hoverText;
            switch (item.type) {
              case 'checkbox':
                option.type = item.type;
                if(Options[section][item.name] === true) option.checked = true;
                option.addEventListener('change', checkboxChanged);
                break;
              case 'text':
                option.type = 'text';
                option.pattern = item.pattern || "[0-9]{1,9}";
                option.value = Number(Options[section][item.name])
                option.addEventListener('change', numberChanged);
                break;
              case 'number':
                option.type = 'number';
                option.min = item.min;
                option.max = item.max;
                option.value = Number(Options[section][item.name])
                option.addEventListener('change', numberChanged);
                break;
            }
            div.id = item.name;
            div.appendChild(option);
            div.appendChild(text);
            elements[section].appendChild(div);
        }
    }
}


numberChanged = function(evt) {
    var src = evt.srcElement;
    var newValue = Number(src.value);
    if (!isNaN(newValue)) {
      Options[src.dataset['section']][src.dataset['key']] = newValue;
      chrome.storage.local.set({
          'options': Options
      });
    }
}

checkboxChanged = function(evt) {
    var src = evt.srcElement;
    var checked = src.checked;
    Options[src.dataset['section']][src.dataset['key']] = checked;
    chrome.storage.local.set({
        'options': Options
    });
}


init = function() {
    chrome.storage.local.get('options', function(options) {
        if(Object.keys(options).length === 0) {
            chrome.storage.local.set({
                'options': Options
            });
        } else {
            Options = options.options;
        }
        renderHTML(optionsTemplate, optionsTemplateSelectors);
    })
}


window.addEventListener('load', init);
