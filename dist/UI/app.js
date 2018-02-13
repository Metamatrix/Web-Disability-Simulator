(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _data = require('./data/data.json');

var languageData = _interopRequireWildcard(_data);

var _simulationLoader = require('../utils/simulationLoader.js');

var simulationLoader = _interopRequireWildcard(_simulationLoader);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

var lang = "en";

function startSimulation() {

  chrome.storage.local.get('activeSimulation', function (obj) {
    simulationLoader.start(obj.activeSimulation);
  });
}

function resetSimulation(tooltip) {

  chrome.browserAction.setIcon({
    path: "img/icon.png"
  });

  tooltip.removeClass("in");
  $("#panel1").addClass("in");
  $('#panel1').removeClass("hide");

  setTimeout(function () {
    tooltip.addClass("hide");
  }, 250);

  chrome.storage.local.get('activeSimulation', function (obj) {
    simulationLoader.stop(obj.activeSimulation);
    chrome.storage.local.remove('activeSimulation');
  });
}

function setTexts() {

  var data = languageData[lang];

  $(".more-info-link").text(data.UI.moreInfo);
  $("#reset-btn").text(data.UI.reset);
  $(".navbar-header").text(data.UI.selectSimulation);
  $("#advice-dropdown").text(data.UI.advice);
  $("#info-dropdown").text(data.UI.moreInfo);
  $("#sight").text(data.UI.sight);
  $("#mobility").text(data.UI.mobility);
  $("#readWrite").text(data.UI.readAndWrite);
  $("#concentration").text(data.UI.concentration);

  $.each(data.UI.simulations, function (i, value) {

    $('#' + value.heading).text(value.heading);

    $.each(value.choices, function (i, value) {
      for (var key in value) {
        $('#' + key).text(value[key]);
      }
    });
  });

  $('#settings-heading').text(data.UI.changeSettings);
  $('#language-label').text(data.UI.selectLanguage);
  $('#btn-save-settings').text(data.UI.saveSettings);
  $('#btn-cancel-settings').text(data.UI.cancel);
}

function setTooltipTexts(activeSimulation) {

  var data = languageData[lang];

  var simulationStatus = $(".simulation-started-paragraph");
  var simulationStatusAlert = $(".simulation-started-alert");
  var infoHeading = $(".disability-info-heading");
  var infoParagraph = $(".disability-info-paragraph");
  var adviceList = $(".advice-list");
  var moreInfoLink = $(".more-info-link");
  var moreInfoPanel = $('#more-info-panel');
  var texts = data.facts[activeSimulation];

  simulationStatus.empty();
  infoHeading.empty();
  infoParagraph.empty();
  adviceList.empty();
  moreInfoLink.empty();

  simulationStatus.text(texts.simulationStatus);
  simulationStatusAlert.removeClass("hide");

  infoHeading.text(texts.heading);
  infoParagraph.text(texts.fact);

  $.each(texts.listItems, function (i, value) {
    adviceList.append('<li>' + value + '</li>');
  });

  if (texts.moreInfoUrl !== undefined) {
    moreInfoPanel.removeClass("hidden");
    moreInfoLink.append(texts.moreInfoLinkText);
    chrome.storage.local.set({ 'linkUrl': texts.moreInfoUrl });
  } else {
    moreInfoPanel.addClass("hidden");
  }
}

$(document).ready(function () {

  var tooltip = $(".tool-tip");

  var activeSimulation = void 0;

  //chrome.storage.local.get('lang', obj => {

  lang = 'en';

  setTexts();

  //});

  // Set active state
  chrome.storage.local.get('activeSimulation', function (obj) {

    activeSimulation = obj.activeSimulation;

    if (activeSimulation) {
      tooltip.addClass("in").removeClass("hide");
      $('#panel1').removeClass("in");
      setTooltipTexts(activeSimulation);
    }
  });

  // Main view
  $(".menu-btn").click(function () {

    var menuBtn = $(this);
    var menuBtnId = menuBtn[0].id;

    chrome.browserAction.setIcon({
      path: "img/icon_active.png"
    });

    activeSimulation = menuBtnId;
    chrome.storage.local.set({ 'activeSimulation': menuBtnId });

    setTooltipTexts(activeSimulation);

    $('#panel1').removeClass("in");
    $('#panel1').addClass("hide");
    $('#panel2').removeClass("hide");
    tooltip.removeClass("hide");

    setTimeout(function () {
      $('#panel2').addClass("in");
    }, 100);

    setTimeout(function () {
      startSimulation();
    }, 500);

    setTimeout(function () {
      $('#panel2').removeClass("in");
      tooltip.addClass("in");
    }, 1000);

    setTimeout(function () {
      $('#panel2').addClass("hide");
    }, 1500);
  });

  $(".github-link").click(function () {
    chrome.tabs.create({ url: 'https://github.com/Metamatrix/Web-Disability-Simulator' });
  });

  $('.settings-link').on('click', function (e) {
    e.preventDefault();

    chrome.storage.local.get('lang', function (obj) {
      $('#language').val(obj.lang);
    });

    $('#panel1').removeClass("in");
    $('#settings').removeClass("hide");

    setTimeout(function () {
      $('#settings').addClass("in");
    }, 250);

    setTimeout(function () {
      $('#panel1').addClass("hide");
    }, 500);
  });

  // Settings view

  /* $('#btn-save-settings').on('click', (e) => {
     e.preventDefault();
  
     var selectedLang = $('#language').val();
  
     chrome.storage.local.set({'lang': selectedLang});
  
     lang = selectedLang;
  
     setTexts();
  
     $('#settings').removeClass("in");
     $('#panel1').removeClass("hide");
  
     setTimeout(() => {
       $('#panel1').addClass("in");
     }, 500);
  
     setTimeout(() => {
       $('#settings').addClass("hide");
     }, 750);
  
   });
  
   $('#btn-cancel-settings').on('click', (e) => {
     e.preventDefault();
  
     $('#settings').removeClass("in");
     $('#panel1').removeClass("hide");
  
     setTimeout(() => {
       $('#panel1').addClass("in");
     }, 250);
  
     setTimeout(() => {
       $('#settings').addClass("hide");
     }, 500);
  
   });*/

  // Tooltip view

  $(".simulation-started-alert .close").click(function () {
    $(".simulation-started-alert").addClass("hide");
  });

  $("#reset-btn").click(function () {
    resetSimulation(tooltip);
  });

  $(".more-info-link").click(function () {
    chrome.storage.local.get('linkUrl', function (obj) {
      chrome.tabs.create({ url: '' + obj.linkUrl });
    });
  });

  //panel collapse, show arrows: 
  $('.collapse').on('shown.bs.collapse', function () {
    $(undefined).parent().find(".down-arrow, .up-arrow").toggle();
  }).on('hidden.bs.collapse', function () {
    $(undefined).parent().find(".down-arrow, .up-arrow").toggle();
  });
});


},{"../utils/simulationLoader.js":3,"./data/data.json":2}],2:[function(require,module,exports){
module.exports={
  "sv":
  {
    "facts": {
      "dyslexia": 
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Dyslexi",
        "fact": "Dyslexi är en nedsättning som gör att hjärnan har svårt att automatisera tolkningen av ord. Detta gör att personer med denna nedsättning kan ha svårt att läsa och skriva. Dyslexi är inte kopplat till syn eller intelligens. Orsakerna till dyslexi är fortfarande oklart.",
        "listItems": [
          "Undvik text i liten storlek och långa texter. Se till att ha ordentligt med radavstånd.", 	
          "Undvik svåra ord och facktermer.",
          "Erbjud lättlästa versioner av facktexter.",
          "Undvik typsnitt med krångliga och komplexa figurer."
          ]
      },
      "parkinsons":
      {
        "simulationStatus": "Simulering aktiv! rör muspekaren på webbplatsen och se vad som händer.",
        "heading": "Parkinsons",
        "fact": "Vid Parkinsons sjukdom förstörs cellerna i hjärnan som tillverkar dopamin vilket gör att hjärnan får en nedsatt förmåga att skicka signaler. Personer med Parkinsons kan drabbas av symptom som skakningar, stela muskler och sämre rörelseförmåga. Orsakerna till Parkinsons sjukdom är fortfarande oklart.",
        "listItems": [
          "Se till att webbplatsen kan användas med andra hjälpmedel än mus, till exempel tangentbordsnavigering.", 	
          "Ha tillräckligt med luft mellan komponenter",
          "Ha tillräckligt stora klickytor."
        ],
        "moreInfoUrl": "http://www.parkinsonforbundet.se",
        "moreInfoLinkText" : "Parkinsonsförbundet"
      },
      "yellowBlueColorBlindness":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Gul-blå färgblindhet",
        "fact": "Personer med defekt färgseende har svårt att skilja på vissa eller alla färger. Ett fullt fungerande öga har tre olika tappar som tar upp färgerna violett, grön och röd. När en eller flera av tapparna saknas eller är defekta leder det till defekt färgseende. Gul-blå färgblindhet (Tritanopi) är sällsynt. Namnet är missledande då det inte är färgerna gul och blå som förväxlas, utan blå med grön och gul med lila.",
        "listItems": [
          "Använd inte färg som det enda sättet att förmedla information, indikera en handling eller identifiera ett element. Markera till exempel inte ett felaktigt formulärfält endast med en röd ram utan komplettera även med text och gärna en ikon.", 	
          "Erbjud gärna ett högkontrast-läge."
        ],
        "moreInfoUrl": "https://sv.wikipedia.org/wiki/Defekt_f%C3%A4rgseende",
        "moreInfoLinkText" : "Wikipedia om defekt färgseende"
      },
      "redGreenColorBlindness":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Röd-grön färgblindhet",
        "fact": "Personer med defekt färgseende har svårt att skilja på vissa eller alla färger. Ett fullt fungerande öga har tre olika tappar som tar upp färgerna violett, grön och röd. När en eller flera av tapparna saknas eller är defekta leder det till defekt färgseende. Röd-grön färgblindhet (Protanopi och Deuteranopi) är den vanligaste typen av färgblindhet. Den är vanligare hos män än kvinnor. Personer röd-grön färgblindhet har svårt att skilja på färgerna röd, grön, brun och orange.",
        "listItems": 
        ["Använd inte färg som enda sättet att förmedla information, indikera en handling eller identifiera ett element. Markera till exempel inte ett felaktigt formulärfält endast med röd ram, komplettera även med text och gärna en  ikon.", "Erbjud gärna ett högkontrast-läge."],
        "moreInfoUrl": "https://sv.wikipedia.org/wiki/Defekt_f%C3%A4rgseende",
        "moreInfoLinkText" : "Wikipedia om defekt färgseende"
      },
      "farsightedness":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Långsynthet",
        "fact": "Personer med Hyperopi ser suddigt på nära håll, men bra på långt håll. Nedsättningen uppstår på grund av att ljuset inte bryts rätt i ögat. Det är en av de vanligaste synnedsättningarna.",
        "listItems": [
          "Undvik text i liten storlek.", 	
          "Webbsidan ska gå att förstora (zoomas) till minst 200 % så att besökaren kan anpassa innehållets storlek efter sina behov.",
          "Erbjud uppläsning av innehållet."
        ],
        "moreInfoUrl": "https://webbriktlinjer.se/r/39-ge-webbplatsen-en-god-lasbarhet/",
        "moreInfoLinkText" : "Webbriktlinje Ge webbplatsen god läsbarhet"
      },
      "totalColorBlindness":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Helt färgblind",
        "fact": "Defekt färgseende innebär att en person har svårt att skilja på vissa eller alla färger. Ett fullt fungerande öga har tre olika typer av tappar som tar upp olika färger: violett, grön och röd. Orsaken till defekt färgseende är att en eller flera av dessa typer av tappar saknas eller är defekta. Helt färgblind (Monokromasi/akromatopsi) är mycket sällsynt. Personer med denna synnedsättning ser inga färger utan ser endast i gråskala.",
        "listItems": [
          "Använd inte färg som det enda sättet att förmedla information, indikera en handling eller identifiera element. Markera t.ex. inte ett felaktigt formulärfält endast med röd ram, komplettera även med text eller ikon.", 	
          "Det kan vara en bra idé att erbjuda ett högkontrast-läge."
        ]
      },
      "tunnelVision":
      {
        "simulationStatus": "Simulering aktiv! rör muspekaren på webbplatsen och se vad som händer.",
        "heading": "Tunnelseende",
        "fact": "Det som i dagligt tal brukar kallas tunnelseende är en synnedsättning som gör att endast en del av synfältet kan ses. Detta kan bero på att personen lider av en sjukdom som gör att cellerna i ögat förstörs men denna typ av synnedsättning kan också tillfälligt uppstå på grund av stress eller depression.",
        "listItems": [
          "Undvik text i liten storlek.",
          "Webbsidan ska gå att förstora (zoomas) till minst 200 % så att besökaren kan anpassa innehållets storlek efter sina behov.",
          "Erbjud uppläsning av innehållet."
        ]
      },
      "sunshine":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Solsken",
        "fact": "Lorem ipsum",
        "listItems": [
          "Lorem ipsum.",
          "Lorem ipsum.",
          "Lorem ipsum"
        ]
      },
      "concentration":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Koncentration",
        "fact": "Alla kan ha svårt att koncentrera sig men för vissa kan det bli ett stort problem i vardagslivet. Dessa funktionsnedsättningar kan orsaka svårigheter med att hantera intryck, sortera information och ljudkänslighet.",
        "listItems": [
          "Ge webbplatsen en enkel och luftig design.",
          "Var försiktig med animationer och starka färger.",
          "Undvik att ha för mycket innehåll på samma sida.",
          "Erbjud ljud- och video-alernativ till textinnehåll."
        ]
      },
      "smallVocabulary":
      {
        "simulationStatus": "Simulering aktiv!",
        "heading": "Litet ordförråd",
        "fact": "En stor del av jordens befolkning kan inte läsa alls och många vuxna läser inte så bra som förväntas efter grundskoleutbildningen.",
        "listItems": [
          "Undvik krångliga ord och facktermer.",   
          "Erbjud lättläst version av krångliga texter.",
          "Erbjud texter på olika språk."
        ]
      }
    },
    "UI": {
      "selectSimulation": "Välj simulering:",
      "reset": "Återställ",
      "advice": "Tänk på detta",
      "moreInfo": "Mer information",
      "sight": "Syn",
      "totalColorBlindness": "Helt färgblind",
      "yellowBlueColorBlindness": "Gul-blå färgblindhet",    
      "redGreenColorBlindness": "Röd-grön färgblindhet",
      "farsightedness": "Långsynthet, översynthet",
      "tunnelVision": "Tunnelseende",
      "mobility": "Motorik",
      "parkinsons": "Parkinsons",
      "readAndWrite": "Läsa och skriva",
      "dyslexia": "Dyslexi",
      "smallVocabulary": "Litet ordförråd",
      "concentration": "Koncentration",
      "changeSettings": "Change settings",
      "selectLanguage": "Select language",
      "saveSettings": "Save settings",
      "cancel": "Cancel",
      "simulations": [
        {
          "heading": "Syn",
          "choices": [
            { "totalColorBlindness": "Helt färgblind" },
            { "yellowBlueColorBlindness": "Gul-blå färgblindhet" },
            { "redGreenColorBlindness": "Röd-grön färgblindhet" },
            { "farsightedness": "Långsynthet, översynthet" },
            { "tunnelVision": "Tunnelseende" },
            { "sunshine": "Solsken" }
          ]
        },
        {
          "heading": "Motorik",
          "choices": [ 
            { "parkinsons": "Parkinsons" }
    
            ]
        },
        {
          "heading": "Läsa och skriva",
          "choices": [
            { "dyslexia": "Dyslexi" },
            { "smallVocabulary": "Litet ordförråd" }
          ]
        },
        {
          "heading": "Koncentration",
          "choices": []
        },
        {
          "heading": "Minne",
          "choices": []
        }

      ]
    }
  },
  "en":
  {
    "facts": {
      "dyslexia": 
      {
        "simulationStatus": "Simulation active!",
        "heading": "Dyslexia",
        "fact": "Dyslexia is a disability that makes it difficult for the brain to automate the interpretation of words. This makes it hard for people with this disability to read and write. Dyslexia is has no connection with vision or intelligence. The causes of dyslexia are still unclear.",
        "listItems": [
          "Avoid text in small font sizes and long texts. Use proper spacing and line height.",
          "Avoid difficult words and terms.",
          "Offer easy to read texts, images, video or audio alternatives.",
          "Avoid fonts with complicated and complex characters."
        ]
      },
      "parkinsons":
      {
        "simulationStatus": "Simulation active! move the mouse pointer on the web page and see what's happening.",
        "heading": "Parkinsons",
        "fact": "Parkinson's disease destroys the cells in the brain that produce dopamine, which causes the brain to have a reduced ability to send signals. Persons with Parkinson's may suffer from symptoms such as shaking, stiff muscles, and reduced mobility. The causes of Parkinson's disease are still unclear.",
        "listItems": [
          "Make sure the website can be used with other tools other than a mouse, such as keyboard navigation.",
          "Have enough space between components.",
          "Make sure click areas are big enough."
        ],
        "moreInfoUrl": "http://www.parkinsonforbundet.se",
        "moreInfoLinkText" : "Parkinson's Association"
      },
      "yellowBlueColorBlindness":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Yellow-blue color blindness",
        "fact": "People with lowered color vision have difficulty distinguishing some or all colors. Yellow-blue color blindness (Tritanopia) is rare. The name can be misleading. It's not the colors yellow and blue that are confused but blue with green and yellow with purple.",
        "listItems": [
          "Do not use color as the only way to convey information, indicate an action or identify an element. For example, do not mark an incorrect form field with a red border only, also supplement with a text and preferably an icon.",
          "Consider offering a high contrast mode."
        ],
        "moreInfoUrl": "https://sv.wikipedia.org/wiki/Defekt_f%C3%A4rgseende",
        "moreInfoLinkText" : "Wikipedia about defective color vision"
      },
      "redGreenColorBlindness":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Red-green color blindness",
        "fact": "People with lowered color vision have difficulty distinguishing some or all colors. Red-green color blindness (Protanopia and Deuteranopia) is the most common type of color blindness. It is more common among men than women. People with red-green color blindness have difficulty distinguishing the colors red, green, brown and orange.",
        "listItems": [
          "Do not use color as the only way to convey information, indicate an action or identify an element. For example, do not mark an incorrect form field with a red border only, also supplement with a text and preferably an icon.",
          "Consider offering a high contrast mode."
        ],
        "moreInfoUrl": "https://sv.wikipedia.org/wiki/Defekt_f%C3%A4rgseende",
        "moreInfoLinkText" : "Wikipedia about defective color vision"
      },
      "farsightedness":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Far-sightedness",
        "fact": "Far-sightedness (Hyperopia) is one of the most common visual impairments. People with Hyperopia have difficulty focusing on objects at close range which makes them appear blurry.",
        "listItems": [
          "Avoid text in small font sizes and long texts. Use proper spacing and line height.",  
          "Make sure the website can be zoomed to at least 200%.",
          "Offer a text to speech reader."
        ],
        "moreInfoUrl": "https://webbriktlinjer.se/r/39-ge-webbplatsen-en-god-lasbarhet/",
        "moreInfoLinkText" : "Good readability"
      },
      "totalColorBlindness":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Total color blindness",
        "fact": "People with lowered color vision have difficulty distinguishing some or all colors. Total color blindness (Monochromatic / Achromatopsy) is very rare. People with this visual impairment can not percieve any colors, only different shades of gray.",
        "listItems": [
          "Do not use color as the only way to convey information, indicate an action or identify an element. For example, do not mark an incorrect form field with a red border only, also supplement with a text and preferably an icon.",
          "Consider offering a high contrast mode."
        ]
      },
      "tunnelVision":
      {
        "simulationStatus": "Simulation active! move the mouse pointer on the web page and see what's happening.",
        "heading": "Tunnel Vision",
        "fact": "What is commonly called Tunnel Vision is loss of peripheral vision. This may be because the person suffers from a disease that affects the cells in the eye, but may also occur temporarily due to stress or depression.",
        "listItems": [
          "Avoid text in small font sizes and long texts. Use proper spacing and line height.",
          "Make sure the website can be zoomed to at least 200%.",
          "Offer a text to speech reader."
        ]
      },
      "sunshine":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Sunshine",
        "fact": "Lorem ipsum",
        "listItems": [
          "Lorem ipsum.",
          "Lorem ipsum.",
          "Lorem ipsum"
        ]
      },
      "concentration":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Concentration",
        "fact": "Everyone can have a hard time concentrating, but for some it can be a big problem in everyday life. Disabilities like ADHD and Autism can cause difficulty in handling impressions, sorting information and sensitivity to sound.",        "listItems": [
          "Give the website a simple and clean design.",
          "Be careful with animations and strong colors.",
          "Avoid having too much content on the same page.",
          "Offer image, audio and video alernatives to text content."
        ]
      },
      "smallVocabulary":
      {
        "simulationStatus": "Simulation active!",
        "heading": "Small vocabulary",
        "fact": "A large part of the world's population can't read at all and many adults don't read as well as expected after finishing grade school.",
        "listItems": [
          "Avoid difficult words and terms.",
          "Offer easy to read texts, images, video or audio alternatives.",
          "Offer texts in different languages."
        ]
      }
    },
    "UI": {
      "selectSimulation": "Select simulation:",
      "reset": "Reset",
      "advice": "Think about this",
      "moreInfo": "More information",
      "sight": "Sight",
      "totalColorBlindness": "Total color blindness",
      "yellowBlueColorBlindness": "Yellow-Blue color blindness",    
      "redGreenColorBlindness": "Red-Green color blindness",
      "farsightedness": "Far-sightedness",
      "tunnelVision": "Tunnel vision",
      "mobility": "Mobility",
      "parkinsons": "Parkinsons",
      "readAndWrite": "Read and write",
      "dyslexia": "Dyslexia",
      "smallVocabulary": "Small vocabulary",
      "concentration": "Concentration",
      "changeSettings": "Change settings",
      "selectLanguage": "Select language",
      "saveSettings": "Save settings",
      "cancel": "Cancel",
      "simulations": [
        {
          "heading": "Sight",
          "choices": [
            { "totalColorBlindness": "Total color blindness" },
            { "yellowBlueColorBlindness": "Yellow-Blue color blindness" },
            { "redGreenColorBlindness": "Red-Green color blindness" },
            { "farsightedness": "Far-sightedness" },
            { "tunnelVision": "Tunnel vision" },
            { "sunshine": "Sunshine" }
          ]
        },
        {
          "heading": "Mobility",
          "choices": [ 
            { "parkinsons": "Parkinsons" }
    
            ]
        },
        {
          "heading": "Read and write",
          "choices": [
            { "dyslexia": "Dyslexia" },
            { "smallVocabulary": "Small vocabulary" }
          ]
        },
        {
          "heading": "Concentration",
          "choices": []
        },
        {
          "heading": "Memory",
          "choices": []
        }

      ]
    }
  }
}
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var loadedSimulations = [];

function load(name, subName, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0],
        scriptFile = subName ? 'simulations/' + name + '/' + subName + '/content.js' : 'simulations/' + name + '/content.js';

    chrome.tabs.executeScript(activeTab.id, { file: scriptFile }, function () {
      loadedSimulations.push(name);
      if (callback) {
        callback(name, subName);
      }
    });
  });
}

function start(name, subName) {
  if (loadedSimulations.includes(name)) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, { action: 'startSimulation', simulation: name, subSimulation: subName });
    });
  } else {
    load(name, subName, function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, { action: 'startSimulation', simulation: name, subSimulation: subName });
      });
    });
  }
}

function stop(name, subName) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, { action: 'stopSimulation', simulation: name, subSimulation: subName });
  });
}

exports.start = start;
exports.stop = stop;


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZFxcanNcXGJhYmVsXFxVSVxcYXBwLmpzIiwiYnVpbGQvanMvYmFiZWwvVUkvZGF0YS9kYXRhLmpzb24iLCJidWlsZFxcanNcXGJhYmVsXFx1dGlsc1xcc2ltdWxhdGlvbkxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLElBQUksUUFBUSxRQUFRLGtCQUFSLENBQVo7O0FBRUEsSUFBSSxlQUFlLHdCQUF3QixLQUF4QixDQUFuQjs7QUFFQSxJQUFJLG9CQUFvQixRQUFRLDhCQUFSLENBQXhCOztBQUVBLElBQUksbUJBQW1CLHdCQUF3QixpQkFBeEIsQ0FBdkI7O0FBRUEsU0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQztBQUFFLE1BQUksT0FBTyxJQUFJLFVBQWYsRUFBMkI7QUFBRSxXQUFPLEdBQVA7QUFBYSxHQUExQyxNQUFnRDtBQUFFLFFBQUksU0FBUyxFQUFiLENBQWlCLElBQUksT0FBTyxJQUFYLEVBQWlCO0FBQUUsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsR0FBaEIsRUFBcUI7QUFBRSxZQUFJLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxHQUFyQyxFQUEwQyxHQUExQyxDQUFKLEVBQW9ELE9BQU8sR0FBUCxJQUFjLElBQUksR0FBSixDQUFkO0FBQXlCO0FBQUUsS0FBQyxPQUFPLE9BQVAsR0FBaUIsR0FBakIsQ0FBc0IsT0FBTyxNQUFQO0FBQWdCO0FBQUU7O0FBRTdRLElBQUksT0FBTyxJQUFYOztBQUVBLFNBQVMsZUFBVCxHQUEyQjs7QUFFekIsU0FBTyxPQUFQLENBQWUsS0FBZixDQUFxQixHQUFyQixDQUF5QixrQkFBekIsRUFBNkMsVUFBVSxHQUFWLEVBQWU7QUFDMUQscUJBQWlCLEtBQWpCLENBQXVCLElBQUksZ0JBQTNCO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVMsZUFBVCxDQUF5QixP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RUFBYSxNQUFiLEdBQXNCLElBQXRCLENBQTJCLHdCQUEzQixFQUFxRCxNQUFyRDtBQUNELEdBRkQsRUFFRyxFQUZILENBRU0sb0JBRk4sRUFFNEIsWUFBWTtBQUN0QyxNQUFFLFNBQUYsRUFBYSxNQUFiLEdBQXNCLElBQXRCLENBQTJCLHdCQUEzQixFQUFxRCxNQUFyRDtBQUNELEdBSkQ7QUFLRCxDQXZKRDtBQXdKQTs7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBOztBQUVBLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUMzQyxTQUFPO0FBRG9DLENBQTdDO0FBR0EsSUFBSSxvQkFBb0IsRUFBeEI7O0FBRUEsU0FBUyxJQUFULENBQWMsSUFBZCxFQUFvQixPQUFwQixFQUE2QixRQUE3QixFQUF1QztBQUNyQyxTQUFPLElBQVAsQ0FBWSxLQUFaLENBQWtCLEVBQUUsUUFBUSxJQUFWLEVBQWdCLGVBQWUsSUFBL0IsRUFBbEIsRUFBeUQsVUFBVSxJQUFWLEVBQWdCO0FBQ3ZFLFFBQUksWUFBWSxLQUFLLENBQUwsQ0FBaEI7QUFBQSxRQUNJLGFBQWEsVUFBVSxpQkFBaUIsSUFBakIsR0FBd0IsR0FBeEIsR0FBOEIsT0FBOUIsR0FBd0MsYUFBbEQsR0FBa0UsaUJBQWlCLElBQWpCLEdBQXdCLGFBRDNHOztBQUdBLFdBQU8sSUFBUCxDQUFZLGFBQVosQ0FBMEIsVUFBVSxFQUFwQyxFQUF3QyxFQUFFLE1BQU0sVUFBUixFQUF4QyxFQUE4RCxZQUFZO0FBQ3hFLHdCQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQUNBLFVBQUksUUFBSixFQUFjO0FBQ1osaUJBQVMsSUFBVCxFQUFlLE9BQWY7QUFDRDtBQUNGLEtBTEQ7QUFNRCxHQVZEO0FBV0Q7O0FBRUQsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixPQUFyQixFQUE4QjtBQUM1QixNQUFJLGtCQUFrQixRQUFsQixDQUEyQixJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLFdBQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsRUFBRSxRQUFRLElBQVYsRUFBZ0IsZUFBZSxJQUEvQixFQUFsQixFQUF5RCxVQUFVLElBQVYsRUFBZ0I7QUFDdkUsVUFBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjs7QUFFQSxhQUFPLElBQVAsQ0FBWSxXQUFaLENBQXdCLFVBQVUsRUFBbEMsRUFBc0MsRUFBRSxRQUFRLGlCQUFWLEVBQTZCLFlBQVksSUFBekMsRUFBK0MsZUFBZSxPQUE5RCxFQUF0QztBQUNELEtBSkQ7QUFLRCxHQU5ELE1BTU87QUFDTCxTQUFLLElBQUwsRUFBVyxPQUFYLEVBQW9CLFlBQVk7QUFDOUIsYUFBTyxJQUFQLENBQVksS0FBWixDQUFrQixFQUFFLFFBQVEsSUFBVixFQUFnQixlQUFlLElBQS9CLEVBQWxCLEVBQXlELFVBQVUsSUFBVixFQUFnQjtBQUN2RSxZQUFJLFlBQVksS0FBSyxDQUFMLENBQWhCOztBQUVBLGVBQU8sSUFBUCxDQUFZLFdBQVosQ0FBd0IsVUFBVSxFQUFsQyxFQUFzQyxFQUFFLFFBQVEsaUJBQVYsRUFBNkIsWUFBWSxJQUF6QyxFQUErQyxlQUFlLE9BQTlELEVBQXRDO0FBQ0QsT0FKRDtBQUtELEtBTkQ7QUFPRDtBQUNGOztBQUVELFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsT0FBcEIsRUFBNkI7QUFDM0IsU0FBTyxJQUFQLENBQVksS0FBWixDQUFrQixFQUFFLFFBQVEsSUFBVixFQUFnQixlQUFlLElBQS9CLEVBQWxCLEVBQXlELFVBQVUsSUFBVixFQUFnQjtBQUN2RSxRQUFJLFlBQVksS0FBSyxDQUFMLENBQWhCOztBQUVBLFdBQU8sSUFBUCxDQUFZLFdBQVosQ0FBd0IsVUFBVSxFQUFsQyxFQUFzQyxFQUFFLFFBQVEsZ0JBQVYsRUFBNEIsWUFBWSxJQUF4QyxFQUE4QyxlQUFlLE9BQTdELEVBQXRDO0FBQ0QsR0FKRDtBQUtEOztBQUVELFFBQVEsS0FBUixHQUFnQixLQUFoQjtBQUNBLFFBQVEsSUFBUixHQUFlLElBQWY7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS9kYXRhLmpzb24nKTtcblxudmFyIGxhbmd1YWdlRGF0YSA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9kYXRhKTtcblxudmFyIF9zaW11bGF0aW9uTG9hZGVyID0gcmVxdWlyZSgnLi4vdXRpbHMvc2ltdWxhdGlvbkxvYWRlci5qcycpO1xuXG52YXIgc2ltdWxhdGlvbkxvYWRlciA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9zaW11bGF0aW9uTG9hZGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxudmFyIGxhbmcgPSBcImVuXCI7XG5cbmZ1bmN0aW9uIHN0YXJ0U2ltdWxhdGlvbigpIHtcblxuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2FjdGl2ZVNpbXVsYXRpb24nLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgc2ltdWxhdGlvbkxvYWRlci5zdGFydChvYmouYWN0aXZlU2ltdWxhdGlvbik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNldFNpbXVsYXRpb24odG9vbHRpcCkge1xuXG4gIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEljb24oe1xuICAgIHBhdGg6IFwiaW1nL2ljb24ucG5nXCJcbiAgfSk7XG5cbiAgdG9vbHRpcC5yZW1vdmVDbGFzcyhcImluXCIpO1xuICAkKFwiI3BhbmVsMVwiKS5hZGRDbGFzcyhcImluXCIpO1xuICAkKCcjcGFuZWwxJykucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHRvb2x0aXAuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuICB9LCAyNTApO1xuXG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnYWN0aXZlU2ltdWxhdGlvbicsIGZ1bmN0aW9uIChvYmopIHtcbiAgICBzaW11bGF0aW9uTG9hZGVyLnN0b3Aob2JqLmFjdGl2ZVNpbXVsYXRpb24pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZSgnYWN0aXZlU2ltdWxhdGlvbicpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0VGV4dHMoKSB7XG5cbiAgdmFyIGRhdGEgPSBsYW5ndWFnZURhdGFbbGFuZ107XG5cbiAgJChcIi5tb3JlLWluZm8tbGlua1wiKS50ZXh0KGRhdGEuVUkubW9yZUluZm8pO1xuICAkKFwiI3Jlc2V0LWJ0blwiKS50ZXh0KGRhdGEuVUkucmVzZXQpO1xuICAkKFwiLm5hdmJhci1oZWFkZXJcIikudGV4dChkYXRhLlVJLnNlbGVjdFNpbXVsYXRpb24pO1xuICAkKFwiI2FkdmljZS1kcm9wZG93blwiKS50ZXh0KGRhdGEuVUkuYWR2aWNlKTtcbiAgJChcIiNpbmZvLWRyb3Bkb3duXCIpLnRleHQoZGF0YS5VSS5tb3JlSW5mbyk7XG4gICQoXCIjc2lnaHRcIikudGV4dChkYXRhLlVJLnNpZ2h0KTtcbiAgJChcIiNtb2JpbGl0eVwiKS50ZXh0KGRhdGEuVUkubW9iaWxpdHkpO1xuICAkKFwiI3JlYWRXcml0ZVwiKS50ZXh0KGRhdGEuVUkucmVhZEFuZFdyaXRlKTtcbiAgJChcIiNjb25jZW50cmF0aW9uXCIpLnRleHQoZGF0YS5VSS5jb25jZW50cmF0aW9uKTtcblxuICAkLmVhY2goZGF0YS5VSS5zaW11bGF0aW9ucywgZnVuY3Rpb24gKGksIHZhbHVlKSB7XG5cbiAgICAkKCcjJyArIHZhbHVlLmhlYWRpbmcpLnRleHQodmFsdWUuaGVhZGluZyk7XG5cbiAgICAkLmVhY2godmFsdWUuY2hvaWNlcywgZnVuY3Rpb24gKGksIHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgJCgnIycgKyBrZXkpLnRleHQodmFsdWVba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gICQoJyNzZXR0aW5ncy1oZWFkaW5nJykudGV4dChkYXRhLlVJLmNoYW5nZVNldHRpbmdzKTtcbiAgJCgnI2xhbmd1YWdlLWxhYmVsJykudGV4dChkYXRhLlVJLnNlbGVjdExhbmd1YWdlKTtcbiAgJCgnI2J0bi1zYXZlLXNldHRpbmdzJykudGV4dChkYXRhLlVJLnNhdmVTZXR0aW5ncyk7XG4gICQoJyNidG4tY2FuY2VsLXNldHRpbmdzJykudGV4dChkYXRhLlVJLmNhbmNlbCk7XG59XG5cbmZ1bmN0aW9uIHNldFRvb2x0aXBUZXh0cyhhY3RpdmVTaW11bGF0aW9uKSB7XG5cbiAgdmFyIGRhdGEgPSBsYW5ndWFnZURhdGFbbGFuZ107XG5cbiAgdmFyIHNpbXVsYXRpb25TdGF0dXMgPSAkKFwiLnNpbXVsYXRpb24tc3RhcnRlZC1wYXJhZ3JhcGhcIik7XG4gIHZhciBzaW11bGF0aW9uU3RhdHVzQWxlcnQgPSAkKFwiLnNpbXVsYXRpb24tc3RhcnRlZC1hbGVydFwiKTtcbiAgdmFyIGluZm9IZWFkaW5nID0gJChcIi5kaXNhYmlsaXR5LWluZm8taGVhZGluZ1wiKTtcbiAgdmFyIGluZm9QYXJhZ3JhcGggPSAkKFwiLmRpc2FiaWxpdHktaW5mby1wYXJhZ3JhcGhcIik7XG4gIHZhciBhZHZpY2VMaXN0ID0gJChcIi5hZHZpY2UtbGlzdFwiKTtcbiAgdmFyIG1vcmVJbmZvTGluayA9ICQoXCIubW9yZS1pbmZvLWxpbmtcIik7XG4gIHZhciBtb3JlSW5mb1BhbmVsID0gJCgnI21vcmUtaW5mby1wYW5lbCcpO1xuICB2YXIgdGV4dHMgPSBkYXRhLmZhY3RzW2FjdGl2ZVNpbXVsYXRpb25dO1xuXG4gIHNpbXVsYXRpb25TdGF0dXMuZW1wdHkoKTtcbiAgaW5mb0hlYWRpbmcuZW1wdHkoKTtcbiAgaW5mb1BhcmFncmFwaC5lbXB0eSgpO1xuICBhZHZpY2VMaXN0LmVtcHR5KCk7XG4gIG1vcmVJbmZvTGluay5lbXB0eSgpO1xuXG4gIHNpbXVsYXRpb25TdGF0dXMudGV4dCh0ZXh0cy5zaW11bGF0aW9uU3RhdHVzKTtcbiAgc2ltdWxhdGlvblN0YXR1c0FsZXJ0LnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcblxuICBpbmZvSGVhZGluZy50ZXh0KHRleHRzLmhlYWRpbmcpO1xuICBpbmZvUGFyYWdyYXBoLnRleHQodGV4dHMuZmFjdCk7XG5cbiAgJC5lYWNoKHRleHRzLmxpc3RJdGVtcywgZnVuY3Rpb24gKGksIHZhbHVlKSB7XG4gICAgYWR2aWNlTGlzdC5hcHBlbmQoJzxsaT4nICsgdmFsdWUgKyAnPC9saT4nKTtcbiAgfSk7XG5cbiAgaWYgKHRleHRzLm1vcmVJbmZvVXJsICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb3JlSW5mb1BhbmVsLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpO1xuICAgIG1vcmVJbmZvTGluay5hcHBlbmQodGV4dHMubW9yZUluZm9MaW5rVGV4dCk7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgJ2xpbmtVcmwnOiB0ZXh0cy5tb3JlSW5mb1VybCB9KTtcbiAgfSBlbHNlIHtcbiAgICBtb3JlSW5mb1BhbmVsLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICB9XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICB2YXIgdG9vbHRpcCA9ICQoXCIudG9vbC10aXBcIik7XG5cbiAgdmFyIGFjdGl2ZVNpbXVsYXRpb24gPSB2b2lkIDA7XG5cbiAgLy9jaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2xhbmcnLCBvYmogPT4ge1xuXG4gIGxhbmcgPSAnZW4nO1xuXG4gIHNldFRleHRzKCk7XG5cbiAgLy99KTtcblxuICAvLyBTZXQgYWN0aXZlIHN0YXRlXG4gIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnYWN0aXZlU2ltdWxhdGlvbicsIGZ1bmN0aW9uIChvYmopIHtcblxuICAgIGFjdGl2ZVNpbXVsYXRpb24gPSBvYmouYWN0aXZlU2ltdWxhdGlvbjtcblxuICAgIGlmIChhY3RpdmVTaW11bGF0aW9uKSB7XG4gICAgICB0b29sdGlwLmFkZENsYXNzKFwiaW5cIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgJCgnI3BhbmVsMScpLnJlbW92ZUNsYXNzKFwiaW5cIik7XG4gICAgICBzZXRUb29sdGlwVGV4dHMoYWN0aXZlU2ltdWxhdGlvbik7XG4gICAgfVxuICB9KTtcblxuICAvLyBNYWluIHZpZXdcbiAgJChcIi5tZW51LWJ0blwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgbWVudUJ0biA9ICQodGhpcyk7XG4gICAgdmFyIG1lbnVCdG5JZCA9IG1lbnVCdG5bMF0uaWQ7XG5cbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRJY29uKHtcbiAgICAgIHBhdGg6IFwiaW1nL2ljb25fYWN0aXZlLnBuZ1wiXG4gICAgfSk7XG5cbiAgICBhY3RpdmVTaW11bGF0aW9uID0gbWVudUJ0bklkO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7ICdhY3RpdmVTaW11bGF0aW9uJzogbWVudUJ0bklkIH0pO1xuXG4gICAgc2V0VG9vbHRpcFRleHRzKGFjdGl2ZVNpbXVsYXRpb24pO1xuXG4gICAgJCgnI3BhbmVsMScpLnJlbW92ZUNsYXNzKFwiaW5cIik7XG4gICAgJCgnI3BhbmVsMScpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICAkKCcjcGFuZWwyJykucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgIHRvb2x0aXAucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjcGFuZWwyJykuYWRkQ2xhc3MoXCJpblwiKTtcbiAgICB9LCAxMDApO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzdGFydFNpbXVsYXRpb24oKTtcbiAgICB9LCA1MDApO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjcGFuZWwyJykucmVtb3ZlQ2xhc3MoXCJpblwiKTtcbiAgICAgIHRvb2x0aXAuYWRkQ2xhc3MoXCJpblwiKTtcbiAgICB9LCAxMDAwKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI3BhbmVsMicpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICB9LCAxNTAwKTtcbiAgfSk7XG5cbiAgJChcIi5naXRodWItbGlua1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL01ldGFtYXRyaXgvV2ViLURpc2FiaWxpdHktU2ltdWxhdG9yJyB9KTtcbiAgfSk7XG5cbiAgJCgnLnNldHRpbmdzLWxpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnbGFuZycsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICQoJyNsYW5ndWFnZScpLnZhbChvYmoubGFuZyk7XG4gICAgfSk7XG5cbiAgICAkKCcjcGFuZWwxJykucmVtb3ZlQ2xhc3MoXCJpblwiKTtcbiAgICAkKCcjc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJyNzZXR0aW5ncycpLmFkZENsYXNzKFwiaW5cIik7XG4gICAgfSwgMjUwKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnI3BhbmVsMScpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICB9LCA1MDApO1xuICB9KTtcblxuICAvLyBTZXR0aW5ncyB2aWV3XG5cbiAgLyogJCgnI2J0bi1zYXZlLXNldHRpbmdzJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgXG4gICAgIHZhciBzZWxlY3RlZExhbmcgPSAkKCcjbGFuZ3VhZ2UnKS52YWwoKTtcclxuICBcbiAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsnbGFuZyc6IHNlbGVjdGVkTGFuZ30pO1xyXG4gIFxuICAgICBsYW5nID0gc2VsZWN0ZWRMYW5nO1xyXG4gIFxuICAgICBzZXRUZXh0cygpO1xyXG4gIFxuICAgICAkKCcjc2V0dGluZ3MnKS5yZW1vdmVDbGFzcyhcImluXCIpO1xyXG4gICAgICQoJyNwYW5lbDEnKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcbiAgXG4gICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgJCgnI3BhbmVsMScpLmFkZENsYXNzKFwiaW5cIik7XHJcbiAgICAgfSwgNTAwKTtcclxuICBcbiAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAkKCcjc2V0dGluZ3MnKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcbiAgICAgfSwgNzUwKTtcclxuICBcbiAgIH0pO1xyXG4gIFxuICAgJCgnI2J0bi1jYW5jZWwtc2V0dGluZ3MnKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICBcbiAgICAgJCgnI3NldHRpbmdzJykucmVtb3ZlQ2xhc3MoXCJpblwiKTtcclxuICAgICAkKCcjcGFuZWwxJykucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG4gIFxuICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICQoJyNwYW5lbDEnKS5hZGRDbGFzcyhcImluXCIpO1xyXG4gICAgIH0sIDI1MCk7XHJcbiAgXG4gICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgJCgnI3NldHRpbmdzJykuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG4gICAgIH0sIDUwMCk7XHJcbiAgXG4gICB9KTsqL1xuXG4gIC8vIFRvb2x0aXAgdmlld1xuXG4gICQoXCIuc2ltdWxhdGlvbi1zdGFydGVkLWFsZXJ0IC5jbG9zZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJChcIi5zaW11bGF0aW9uLXN0YXJ0ZWQtYWxlcnRcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xuICB9KTtcblxuICAkKFwiI3Jlc2V0LWJ0blwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgcmVzZXRTaW11bGF0aW9uKHRvb2x0aXApO1xuICB9KTtcblxuICAkKFwiLm1vcmUtaW5mby1saW5rXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2xpbmtVcmwnLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6ICcnICsgb2JqLmxpbmtVcmwgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vcGFuZWwgY29sbGFwc2UsIHNob3cgYXJyb3dzOiBcbiAgJCgnLmNvbGxhcHNlJykub24oJ3Nob3duLmJzLmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xuICAgICQodW5kZWZpbmVkKS5wYXJlbnQoKS5maW5kKFwiLmRvd24tYXJyb3csIC51cC1hcnJvd1wiKS50b2dnbGUoKTtcbiAgfSkub24oJ2hpZGRlbi5icy5jb2xsYXBzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAkKHVuZGVmaW5lZCkucGFyZW50KCkuZmluZChcIi5kb3duLWFycm93LCAudXAtYXJyb3dcIikudG9nZ2xlKCk7XG4gIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwXG4iLCJtb2R1bGUuZXhwb3J0cz17XHJcbiAgXCJzdlwiOlxyXG4gIHtcclxuICAgIFwiZmFjdHNcIjoge1xyXG4gICAgICBcImR5c2xleGlhXCI6IFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzaW11bGF0aW9uU3RhdHVzXCI6IFwiU2ltdWxlcmluZyBha3RpdiFcIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJEeXNsZXhpXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiRHlzbGV4aSDDpHIgZW4gbmVkc8OkdHRuaW5nIHNvbSBnw7ZyIGF0dCBoasOkcm5hbiBoYXIgc3bDpXJ0IGF0dCBhdXRvbWF0aXNlcmEgdG9sa25pbmdlbiBhdiBvcmQuIERldHRhIGfDtnIgYXR0IHBlcnNvbmVyIG1lZCBkZW5uYSBuZWRzw6R0dG5pbmcga2FuIGhhIHN2w6VydCBhdHQgbMOkc2Egb2NoIHNrcml2YS4gRHlzbGV4aSDDpHIgaW50ZSBrb3BwbGF0IHRpbGwgc3luIGVsbGVyIGludGVsbGlnZW5zLiBPcnNha2VybmEgdGlsbCBkeXNsZXhpIMOkciBmb3J0ZmFyYW5kZSBva2xhcnQuXCIsXHJcbiAgICAgICAgXCJsaXN0SXRlbXNcIjogW1xyXG4gICAgICAgICAgXCJVbmR2aWsgdGV4dCBpIGxpdGVuIHN0b3JsZWsgb2NoIGzDpW5nYSB0ZXh0ZXIuIFNlIHRpbGwgYXR0IGhhIG9yZGVudGxpZ3QgbWVkIHJhZGF2c3TDpW5kLlwiLCBcdFxyXG4gICAgICAgICAgXCJVbmR2aWsgc3bDpXJhIG9yZCBvY2ggZmFja3Rlcm1lci5cIixcclxuICAgICAgICAgIFwiRXJianVkIGzDpHR0bMOkc3RhIHZlcnNpb25lciBhdiBmYWNrdGV4dGVyLlwiLFxyXG4gICAgICAgICAgXCJVbmR2aWsgdHlwc25pdHQgbWVkIGtyw6VuZ2xpZ2Egb2NoIGtvbXBsZXhhIGZpZ3VyZXIuXCJcclxuICAgICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgXCJwYXJraW5zb25zXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGVyaW5nIGFrdGl2ISByw7ZyIG11c3Bla2FyZW4gcMOlIHdlYmJwbGF0c2VuIG9jaCBzZSB2YWQgc29tIGjDpG5kZXIuXCIsXHJcbiAgICAgICAgXCJoZWFkaW5nXCI6IFwiUGFya2luc29uc1wiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIlZpZCBQYXJraW5zb25zIHNqdWtkb20gZsO2cnN0w7ZycyBjZWxsZXJuYSBpIGhqw6RybmFuIHNvbSB0aWxsdmVya2FyIGRvcGFtaW4gdmlsa2V0IGfDtnIgYXR0IGhqw6RybmFuIGbDpXIgZW4gbmVkc2F0dCBmw7ZybcOlZ2EgYXR0IHNraWNrYSBzaWduYWxlci4gUGVyc29uZXIgbWVkIFBhcmtpbnNvbnMga2FuIGRyYWJiYXMgYXYgc3ltcHRvbSBzb20gc2tha25pbmdhciwgc3RlbGEgbXVza2xlciBvY2ggc8OkbXJlIHLDtnJlbHNlZsO2cm3DpWdhLiBPcnNha2VybmEgdGlsbCBQYXJraW5zb25zIHNqdWtkb20gw6RyIGZvcnRmYXJhbmRlIG9rbGFydC5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIlNlIHRpbGwgYXR0IHdlYmJwbGF0c2VuIGthbiBhbnbDpG5kYXMgbWVkIGFuZHJhIGhqw6RscG1lZGVsIMOkbiBtdXMsIHRpbGwgZXhlbXBlbCB0YW5nZW50Ym9yZHNuYXZpZ2VyaW5nLlwiLCBcdFxyXG4gICAgICAgICAgXCJIYSB0aWxscsOkY2tsaWd0IG1lZCBsdWZ0IG1lbGxhbiBrb21wb25lbnRlclwiLFxyXG4gICAgICAgICAgXCJIYSB0aWxscsOkY2tsaWd0IHN0b3JhIGtsaWNreXRvci5cIlxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJtb3JlSW5mb1VybFwiOiBcImh0dHA6Ly93d3cucGFya2luc29uZm9yYnVuZGV0LnNlXCIsXHJcbiAgICAgICAgXCJtb3JlSW5mb0xpbmtUZXh0XCIgOiBcIlBhcmtpbnNvbnNmw7ZyYnVuZGV0XCJcclxuICAgICAgfSxcclxuICAgICAgXCJ5ZWxsb3dCbHVlQ29sb3JCbGluZG5lc3NcIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsZXJpbmcgYWt0aXYhXCIsXHJcbiAgICAgICAgXCJoZWFkaW5nXCI6IFwiR3VsLWJsw6UgZsOkcmdibGluZGhldFwiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIlBlcnNvbmVyIG1lZCBkZWZla3QgZsOkcmdzZWVuZGUgaGFyIHN2w6VydCBhdHQgc2tpbGphIHDDpSB2aXNzYSBlbGxlciBhbGxhIGbDpHJnZXIuIEV0dCBmdWxsdCBmdW5nZXJhbmRlIMO2Z2EgaGFyIHRyZSBvbGlrYSB0YXBwYXIgc29tIHRhciB1cHAgZsOkcmdlcm5hIHZpb2xldHQsIGdyw7ZuIG9jaCByw7ZkLiBOw6RyIGVuIGVsbGVyIGZsZXJhIGF2IHRhcHBhcm5hIHNha25hcyBlbGxlciDDpHIgZGVmZWt0YSBsZWRlciBkZXQgdGlsbCBkZWZla3QgZsOkcmdzZWVuZGUuIEd1bC1ibMOlIGbDpHJnYmxpbmRoZXQgKFRyaXRhbm9waSkgw6RyIHPDpGxsc3ludC4gTmFtbmV0IMOkciBtaXNzbGVkYW5kZSBkw6UgZGV0IGludGUgw6RyIGbDpHJnZXJuYSBndWwgb2NoIGJsw6Ugc29tIGbDtnJ2w6R4bGFzLCB1dGFuIGJsw6UgbWVkIGdyw7ZuIG9jaCBndWwgbWVkIGxpbGEuXCIsXHJcbiAgICAgICAgXCJsaXN0SXRlbXNcIjogW1xyXG4gICAgICAgICAgXCJBbnbDpG5kIGludGUgZsOkcmcgc29tIGRldCBlbmRhIHPDpHR0ZXQgYXR0IGbDtnJtZWRsYSBpbmZvcm1hdGlvbiwgaW5kaWtlcmEgZW4gaGFuZGxpbmcgZWxsZXIgaWRlbnRpZmllcmEgZXR0IGVsZW1lbnQuIE1hcmtlcmEgdGlsbCBleGVtcGVsIGludGUgZXR0IGZlbGFrdGlndCBmb3JtdWzDpHJmw6RsdCBlbmRhc3QgbWVkIGVuIHLDtmQgcmFtIHV0YW4ga29tcGxldHRlcmEgw6R2ZW4gbWVkIHRleHQgb2NoIGfDpHJuYSBlbiBpa29uLlwiLCBcdFxyXG4gICAgICAgICAgXCJFcmJqdWQgZ8Okcm5hIGV0dCBow7Zna29udHJhc3QtbMOkZ2UuXCJcclxuICAgICAgICBdLFxyXG4gICAgICAgIFwibW9yZUluZm9VcmxcIjogXCJodHRwczovL3N2Lndpa2lwZWRpYS5vcmcvd2lraS9EZWZla3RfZiVDMyVBNHJnc2VlbmRlXCIsXHJcbiAgICAgICAgXCJtb3JlSW5mb0xpbmtUZXh0XCIgOiBcIldpa2lwZWRpYSBvbSBkZWZla3QgZsOkcmdzZWVuZGVcIlxyXG4gICAgICB9LFxyXG4gICAgICBcInJlZEdyZWVuQ29sb3JCbGluZG5lc3NcIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsZXJpbmcgYWt0aXYhXCIsXHJcbiAgICAgICAgXCJoZWFkaW5nXCI6IFwiUsO2ZC1ncsO2biBmw6RyZ2JsaW5kaGV0XCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiUGVyc29uZXIgbWVkIGRlZmVrdCBmw6RyZ3NlZW5kZSBoYXIgc3bDpXJ0IGF0dCBza2lsamEgcMOlIHZpc3NhIGVsbGVyIGFsbGEgZsOkcmdlci4gRXR0IGZ1bGx0IGZ1bmdlcmFuZGUgw7ZnYSBoYXIgdHJlIG9saWthIHRhcHBhciBzb20gdGFyIHVwcCBmw6RyZ2VybmEgdmlvbGV0dCwgZ3LDtm4gb2NoIHLDtmQuIE7DpHIgZW4gZWxsZXIgZmxlcmEgYXYgdGFwcGFybmEgc2FrbmFzIGVsbGVyIMOkciBkZWZla3RhIGxlZGVyIGRldCB0aWxsIGRlZmVrdCBmw6RyZ3NlZW5kZS4gUsO2ZC1ncsO2biBmw6RyZ2JsaW5kaGV0IChQcm90YW5vcGkgb2NoIERldXRlcmFub3BpKSDDpHIgZGVuIHZhbmxpZ2FzdGUgdHlwZW4gYXYgZsOkcmdibGluZGhldC4gRGVuIMOkciB2YW5saWdhcmUgaG9zIG3DpG4gw6RuIGt2aW5ub3IuIFBlcnNvbmVyIHLDtmQtZ3LDtm4gZsOkcmdibGluZGhldCBoYXIgc3bDpXJ0IGF0dCBza2lsamEgcMOlIGbDpHJnZXJuYSByw7ZkLCBncsO2biwgYnJ1biBvY2ggb3JhbmdlLlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFxyXG4gICAgICAgIFtcIkFudsOkbmQgaW50ZSBmw6RyZyBzb20gZW5kYSBzw6R0dGV0IGF0dCBmw7ZybWVkbGEgaW5mb3JtYXRpb24sIGluZGlrZXJhIGVuIGhhbmRsaW5nIGVsbGVyIGlkZW50aWZpZXJhIGV0dCBlbGVtZW50LiBNYXJrZXJhIHRpbGwgZXhlbXBlbCBpbnRlIGV0dCBmZWxha3RpZ3QgZm9ybXVsw6RyZsOkbHQgZW5kYXN0IG1lZCByw7ZkIHJhbSwga29tcGxldHRlcmEgw6R2ZW4gbWVkIHRleHQgb2NoIGfDpHJuYSBlbiAgaWtvbi5cIiwgXCJFcmJqdWQgZ8Okcm5hIGV0dCBow7Zna29udHJhc3QtbMOkZ2UuXCJdLFxyXG4gICAgICAgIFwibW9yZUluZm9VcmxcIjogXCJodHRwczovL3N2Lndpa2lwZWRpYS5vcmcvd2lraS9EZWZla3RfZiVDMyVBNHJnc2VlbmRlXCIsXHJcbiAgICAgICAgXCJtb3JlSW5mb0xpbmtUZXh0XCIgOiBcIldpa2lwZWRpYSBvbSBkZWZla3QgZsOkcmdzZWVuZGVcIlxyXG4gICAgICB9LFxyXG4gICAgICBcImZhcnNpZ2h0ZWRuZXNzXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGVyaW5nIGFrdGl2IVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIkzDpW5nc3ludGhldFwiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIlBlcnNvbmVyIG1lZCBIeXBlcm9waSBzZXIgc3VkZGlndCBww6UgbsOkcmEgaMOlbGwsIG1lbiBicmEgcMOlIGzDpW5ndCBow6VsbC4gTmVkc8OkdHRuaW5nZW4gdXBwc3TDpXIgcMOlIGdydW5kIGF2IGF0dCBsanVzZXQgaW50ZSBicnl0cyByw6R0dCBpIMO2Z2F0LiBEZXQgw6RyIGVuIGF2IGRlIHZhbmxpZ2FzdGUgc3lubmVkc8OkdHRuaW5nYXJuYS5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIlVuZHZpayB0ZXh0IGkgbGl0ZW4gc3Rvcmxlay5cIiwgXHRcclxuICAgICAgICAgIFwiV2ViYnNpZGFuIHNrYSBnw6UgYXR0IGbDtnJzdG9yYSAoem9vbWFzKSB0aWxsIG1pbnN0IDIwMCAlIHPDpSBhdHQgYmVzw7ZrYXJlbiBrYW4gYW5wYXNzYSBpbm5laMOlbGxldHMgc3RvcmxlayBlZnRlciBzaW5hIGJlaG92LlwiLFxyXG4gICAgICAgICAgXCJFcmJqdWQgdXBwbMOkc25pbmcgYXYgaW5uZWjDpWxsZXQuXCJcclxuICAgICAgICBdLFxyXG4gICAgICAgIFwibW9yZUluZm9VcmxcIjogXCJodHRwczovL3dlYmJyaWt0bGluamVyLnNlL3IvMzktZ2Utd2ViYnBsYXRzZW4tZW4tZ29kLWxhc2JhcmhldC9cIixcclxuICAgICAgICBcIm1vcmVJbmZvTGlua1RleHRcIiA6IFwiV2ViYnJpa3RsaW5qZSBHZSB3ZWJicGxhdHNlbiBnb2QgbMOkc2JhcmhldFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwidG90YWxDb2xvckJsaW5kbmVzc1wiOlxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzaW11bGF0aW9uU3RhdHVzXCI6IFwiU2ltdWxlcmluZyBha3RpdiFcIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJIZWx0IGbDpHJnYmxpbmRcIixcclxuICAgICAgICBcImZhY3RcIjogXCJEZWZla3QgZsOkcmdzZWVuZGUgaW5uZWLDpHIgYXR0IGVuIHBlcnNvbiBoYXIgc3bDpXJ0IGF0dCBza2lsamEgcMOlIHZpc3NhIGVsbGVyIGFsbGEgZsOkcmdlci4gRXR0IGZ1bGx0IGZ1bmdlcmFuZGUgw7ZnYSBoYXIgdHJlIG9saWthIHR5cGVyIGF2IHRhcHBhciBzb20gdGFyIHVwcCBvbGlrYSBmw6RyZ2VyOiB2aW9sZXR0LCBncsO2biBvY2ggcsO2ZC4gT3JzYWtlbiB0aWxsIGRlZmVrdCBmw6RyZ3NlZW5kZSDDpHIgYXR0IGVuIGVsbGVyIGZsZXJhIGF2IGRlc3NhIHR5cGVyIGF2IHRhcHBhciBzYWtuYXMgZWxsZXIgw6RyIGRlZmVrdGEuIEhlbHQgZsOkcmdibGluZCAoTW9ub2tyb21hc2kvYWtyb21hdG9wc2kpIMOkciBteWNrZXQgc8OkbGxzeW50LiBQZXJzb25lciBtZWQgZGVubmEgc3lubmVkc8OkdHRuaW5nIHNlciBpbmdhIGbDpHJnZXIgdXRhbiBzZXIgZW5kYXN0IGkgZ3LDpXNrYWxhLlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiQW52w6RuZCBpbnRlIGbDpHJnIHNvbSBkZXQgZW5kYSBzw6R0dGV0IGF0dCBmw7ZybWVkbGEgaW5mb3JtYXRpb24sIGluZGlrZXJhIGVuIGhhbmRsaW5nIGVsbGVyIGlkZW50aWZpZXJhIGVsZW1lbnQuIE1hcmtlcmEgdC5leC4gaW50ZSBldHQgZmVsYWt0aWd0IGZvcm11bMOkcmbDpGx0IGVuZGFzdCBtZWQgcsO2ZCByYW0sIGtvbXBsZXR0ZXJhIMOkdmVuIG1lZCB0ZXh0IGVsbGVyIGlrb24uXCIsIFx0XHJcbiAgICAgICAgICBcIkRldCBrYW4gdmFyYSBlbiBicmEgaWTDqSBhdHQgZXJianVkYSBldHQgaMO2Z2tvbnRyYXN0LWzDpGdlLlwiXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBcInR1bm5lbFZpc2lvblwiOlxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzaW11bGF0aW9uU3RhdHVzXCI6IFwiU2ltdWxlcmluZyBha3RpdiEgcsO2ciBtdXNwZWthcmVuIHDDpSB3ZWJicGxhdHNlbiBvY2ggc2UgdmFkIHNvbSBow6RuZGVyLlwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIlR1bm5lbHNlZW5kZVwiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIkRldCBzb20gaSBkYWdsaWd0IHRhbCBicnVrYXIga2FsbGFzIHR1bm5lbHNlZW5kZSDDpHIgZW4gc3lubmVkc8OkdHRuaW5nIHNvbSBnw7ZyIGF0dCBlbmRhc3QgZW4gZGVsIGF2IHN5bmbDpGx0ZXQga2FuIHNlcy4gRGV0dGEga2FuIGJlcm8gcMOlIGF0dCBwZXJzb25lbiBsaWRlciBhdiBlbiBzanVrZG9tIHNvbSBnw7ZyIGF0dCBjZWxsZXJuYSBpIMO2Z2F0IGbDtnJzdMO2cnMgbWVuIGRlbm5hIHR5cCBhdiBzeW5uZWRzw6R0dG5pbmcga2FuIG9ja3PDpSB0aWxsZsOkbGxpZ3QgdXBwc3TDpSBww6UgZ3J1bmQgYXYgc3RyZXNzIGVsbGVyIGRlcHJlc3Npb24uXCIsXHJcbiAgICAgICAgXCJsaXN0SXRlbXNcIjogW1xyXG4gICAgICAgICAgXCJVbmR2aWsgdGV4dCBpIGxpdGVuIHN0b3JsZWsuXCIsXHJcbiAgICAgICAgICBcIldlYmJzaWRhbiBza2EgZ8OlIGF0dCBmw7Zyc3RvcmEgKHpvb21hcykgdGlsbCBtaW5zdCAyMDAgJSBzw6UgYXR0IGJlc8O2a2FyZW4ga2FuIGFucGFzc2EgaW5uZWjDpWxsZXRzIHN0b3JsZWsgZWZ0ZXIgc2luYSBiZWhvdi5cIixcclxuICAgICAgICAgIFwiRXJianVkIHVwcGzDpHNuaW5nIGF2IGlubmVow6VsbGV0LlwiXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBcInN1bnNoaW5lXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGVyaW5nIGFrdGl2IVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIlNvbHNrZW5cIixcclxuICAgICAgICBcImZhY3RcIjogXCJMb3JlbSBpcHN1bVwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiTG9yZW0gaXBzdW0uXCIsXHJcbiAgICAgICAgICBcIkxvcmVtIGlwc3VtLlwiLFxyXG4gICAgICAgICAgXCJMb3JlbSBpcHN1bVwiXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBcImNvbmNlbnRyYXRpb25cIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsZXJpbmcgYWt0aXYhXCIsXHJcbiAgICAgICAgXCJoZWFkaW5nXCI6IFwiS29uY2VudHJhdGlvblwiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIkFsbGEga2FuIGhhIHN2w6VydCBhdHQga29uY2VudHJlcmEgc2lnIG1lbiBmw7ZyIHZpc3NhIGthbiBkZXQgYmxpIGV0dCBzdG9ydCBwcm9ibGVtIGkgdmFyZGFnc2xpdmV0LiBEZXNzYSBmdW5rdGlvbnNuZWRzw6R0dG5pbmdhciBrYW4gb3JzYWthIHN2w6VyaWdoZXRlciBtZWQgYXR0IGhhbnRlcmEgaW50cnljaywgc29ydGVyYSBpbmZvcm1hdGlvbiBvY2ggbGp1ZGvDpG5zbGlnaGV0LlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiR2Ugd2ViYnBsYXRzZW4gZW4gZW5rZWwgb2NoIGx1ZnRpZyBkZXNpZ24uXCIsXHJcbiAgICAgICAgICBcIlZhciBmw7Zyc2lrdGlnIG1lZCBhbmltYXRpb25lciBvY2ggc3RhcmthIGbDpHJnZXIuXCIsXHJcbiAgICAgICAgICBcIlVuZHZpayBhdHQgaGEgZsO2ciBteWNrZXQgaW5uZWjDpWxsIHDDpSBzYW1tYSBzaWRhLlwiLFxyXG4gICAgICAgICAgXCJFcmJqdWQgbGp1ZC0gb2NoIHZpZGVvLWFsZXJuYXRpdiB0aWxsIHRleHRpbm5laMOlbGwuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwic21hbGxWb2NhYnVsYXJ5XCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGVyaW5nIGFrdGl2IVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIkxpdGV0IG9yZGbDtnJyw6VkXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiRW4gc3RvciBkZWwgYXYgam9yZGVucyBiZWZvbGtuaW5nIGthbiBpbnRlIGzDpHNhIGFsbHMgb2NoIG3DpW5nYSB2dXhuYSBsw6RzZXIgaW50ZSBzw6UgYnJhIHNvbSBmw7ZydsOkbnRhcyBlZnRlciBncnVuZHNrb2xldXRiaWxkbmluZ2VuLlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiVW5kdmlrIGtyw6VuZ2xpZ2Egb3JkIG9jaCBmYWNrdGVybWVyLlwiLCAgIFxyXG4gICAgICAgICAgXCJFcmJqdWQgbMOkdHRsw6RzdCB2ZXJzaW9uIGF2IGtyw6VuZ2xpZ2EgdGV4dGVyLlwiLFxyXG4gICAgICAgICAgXCJFcmJqdWQgdGV4dGVyIHDDpSBvbGlrYSBzcHLDpWsuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIlVJXCI6IHtcclxuICAgICAgXCJzZWxlY3RTaW11bGF0aW9uXCI6IFwiVsOkbGogc2ltdWxlcmluZzpcIixcclxuICAgICAgXCJyZXNldFwiOiBcIsOFdGVyc3TDpGxsXCIsXHJcbiAgICAgIFwiYWR2aWNlXCI6IFwiVMOkbmsgcMOlIGRldHRhXCIsXHJcbiAgICAgIFwibW9yZUluZm9cIjogXCJNZXIgaW5mb3JtYXRpb25cIixcclxuICAgICAgXCJzaWdodFwiOiBcIlN5blwiLFxyXG4gICAgICBcInRvdGFsQ29sb3JCbGluZG5lc3NcIjogXCJIZWx0IGbDpHJnYmxpbmRcIixcclxuICAgICAgXCJ5ZWxsb3dCbHVlQ29sb3JCbGluZG5lc3NcIjogXCJHdWwtYmzDpSBmw6RyZ2JsaW5kaGV0XCIsICAgIFxyXG4gICAgICBcInJlZEdyZWVuQ29sb3JCbGluZG5lc3NcIjogXCJSw7ZkLWdyw7ZuIGbDpHJnYmxpbmRoZXRcIixcclxuICAgICAgXCJmYXJzaWdodGVkbmVzc1wiOiBcIkzDpW5nc3ludGhldCwgw7Z2ZXJzeW50aGV0XCIsXHJcbiAgICAgIFwidHVubmVsVmlzaW9uXCI6IFwiVHVubmVsc2VlbmRlXCIsXHJcbiAgICAgIFwibW9iaWxpdHlcIjogXCJNb3RvcmlrXCIsXHJcbiAgICAgIFwicGFya2luc29uc1wiOiBcIlBhcmtpbnNvbnNcIixcclxuICAgICAgXCJyZWFkQW5kV3JpdGVcIjogXCJMw6RzYSBvY2ggc2tyaXZhXCIsXHJcbiAgICAgIFwiZHlzbGV4aWFcIjogXCJEeXNsZXhpXCIsXHJcbiAgICAgIFwic21hbGxWb2NhYnVsYXJ5XCI6IFwiTGl0ZXQgb3JkZsO2cnLDpWRcIixcclxuICAgICAgXCJjb25jZW50cmF0aW9uXCI6IFwiS29uY2VudHJhdGlvblwiLFxyXG4gICAgICBcImNoYW5nZVNldHRpbmdzXCI6IFwiQ2hhbmdlIHNldHRpbmdzXCIsXHJcbiAgICAgIFwic2VsZWN0TGFuZ3VhZ2VcIjogXCJTZWxlY3QgbGFuZ3VhZ2VcIixcclxuICAgICAgXCJzYXZlU2V0dGluZ3NcIjogXCJTYXZlIHNldHRpbmdzXCIsXHJcbiAgICAgIFwiY2FuY2VsXCI6IFwiQ2FuY2VsXCIsXHJcbiAgICAgIFwic2ltdWxhdGlvbnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaGVhZGluZ1wiOiBcIlN5blwiLFxyXG4gICAgICAgICAgXCJjaG9pY2VzXCI6IFtcclxuICAgICAgICAgICAgeyBcInRvdGFsQ29sb3JCbGluZG5lc3NcIjogXCJIZWx0IGbDpHJnYmxpbmRcIiB9LFxyXG4gICAgICAgICAgICB7IFwieWVsbG93Qmx1ZUNvbG9yQmxpbmRuZXNzXCI6IFwiR3VsLWJsw6UgZsOkcmdibGluZGhldFwiIH0sXHJcbiAgICAgICAgICAgIHsgXCJyZWRHcmVlbkNvbG9yQmxpbmRuZXNzXCI6IFwiUsO2ZC1ncsO2biBmw6RyZ2JsaW5kaGV0XCIgfSxcclxuICAgICAgICAgICAgeyBcImZhcnNpZ2h0ZWRuZXNzXCI6IFwiTMOlbmdzeW50aGV0LCDDtnZlcnN5bnRoZXRcIiB9LFxyXG4gICAgICAgICAgICB7IFwidHVubmVsVmlzaW9uXCI6IFwiVHVubmVsc2VlbmRlXCIgfSxcclxuICAgICAgICAgICAgeyBcInN1bnNoaW5lXCI6IFwiU29sc2tlblwiIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaGVhZGluZ1wiOiBcIk1vdG9yaWtcIixcclxuICAgICAgICAgIFwiY2hvaWNlc1wiOiBbIFxyXG4gICAgICAgICAgICB7IFwicGFya2luc29uc1wiOiBcIlBhcmtpbnNvbnNcIiB9XHJcbiAgICBcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJoZWFkaW5nXCI6IFwiTMOkc2Egb2NoIHNrcml2YVwiLFxyXG4gICAgICAgICAgXCJjaG9pY2VzXCI6IFtcclxuICAgICAgICAgICAgeyBcImR5c2xleGlhXCI6IFwiRHlzbGV4aVwiIH0sXHJcbiAgICAgICAgICAgIHsgXCJzbWFsbFZvY2FidWxhcnlcIjogXCJMaXRldCBvcmRmw7ZycsOlZFwiIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaGVhZGluZ1wiOiBcIktvbmNlbnRyYXRpb25cIixcclxuICAgICAgICAgIFwiY2hvaWNlc1wiOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJoZWFkaW5nXCI6IFwiTWlubmVcIixcclxuICAgICAgICAgIFwiY2hvaWNlc1wiOiBbXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9LFxyXG4gIFwiZW5cIjpcclxuICB7XHJcbiAgICBcImZhY3RzXCI6IHtcclxuICAgICAgXCJkeXNsZXhpYVwiOiBcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsYXRpb24gYWN0aXZlIVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIkR5c2xleGlhXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiRHlzbGV4aWEgaXMgYSBkaXNhYmlsaXR5IHRoYXQgbWFrZXMgaXQgZGlmZmljdWx0IGZvciB0aGUgYnJhaW4gdG8gYXV0b21hdGUgdGhlIGludGVycHJldGF0aW9uIG9mIHdvcmRzLiBUaGlzIG1ha2VzIGl0IGhhcmQgZm9yIHBlb3BsZSB3aXRoIHRoaXMgZGlzYWJpbGl0eSB0byByZWFkIGFuZCB3cml0ZS4gRHlzbGV4aWEgaXMgaGFzIG5vIGNvbm5lY3Rpb24gd2l0aCB2aXNpb24gb3IgaW50ZWxsaWdlbmNlLiBUaGUgY2F1c2VzIG9mIGR5c2xleGlhIGFyZSBzdGlsbCB1bmNsZWFyLlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiQXZvaWQgdGV4dCBpbiBzbWFsbCBmb250IHNpemVzIGFuZCBsb25nIHRleHRzLiBVc2UgcHJvcGVyIHNwYWNpbmcgYW5kIGxpbmUgaGVpZ2h0LlwiLFxyXG4gICAgICAgICAgXCJBdm9pZCBkaWZmaWN1bHQgd29yZHMgYW5kIHRlcm1zLlwiLFxyXG4gICAgICAgICAgXCJPZmZlciBlYXN5IHRvIHJlYWQgdGV4dHMsIGltYWdlcywgdmlkZW8gb3IgYXVkaW8gYWx0ZXJuYXRpdmVzLlwiLFxyXG4gICAgICAgICAgXCJBdm9pZCBmb250cyB3aXRoIGNvbXBsaWNhdGVkIGFuZCBjb21wbGV4IGNoYXJhY3RlcnMuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicGFya2luc29uc1wiOlxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzaW11bGF0aW9uU3RhdHVzXCI6IFwiU2ltdWxhdGlvbiBhY3RpdmUhIG1vdmUgdGhlIG1vdXNlIHBvaW50ZXIgb24gdGhlIHdlYiBwYWdlIGFuZCBzZWUgd2hhdCdzIGhhcHBlbmluZy5cIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJQYXJraW5zb25zXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiUGFya2luc29uJ3MgZGlzZWFzZSBkZXN0cm95cyB0aGUgY2VsbHMgaW4gdGhlIGJyYWluIHRoYXQgcHJvZHVjZSBkb3BhbWluZSwgd2hpY2ggY2F1c2VzIHRoZSBicmFpbiB0byBoYXZlIGEgcmVkdWNlZCBhYmlsaXR5IHRvIHNlbmQgc2lnbmFscy4gUGVyc29ucyB3aXRoIFBhcmtpbnNvbidzIG1heSBzdWZmZXIgZnJvbSBzeW1wdG9tcyBzdWNoIGFzIHNoYWtpbmcsIHN0aWZmIG11c2NsZXMsIGFuZCByZWR1Y2VkIG1vYmlsaXR5LiBUaGUgY2F1c2VzIG9mIFBhcmtpbnNvbidzIGRpc2Vhc2UgYXJlIHN0aWxsIHVuY2xlYXIuXCIsXHJcbiAgICAgICAgXCJsaXN0SXRlbXNcIjogW1xyXG4gICAgICAgICAgXCJNYWtlIHN1cmUgdGhlIHdlYnNpdGUgY2FuIGJlIHVzZWQgd2l0aCBvdGhlciB0b29scyBvdGhlciB0aGFuIGEgbW91c2UsIHN1Y2ggYXMga2V5Ym9hcmQgbmF2aWdhdGlvbi5cIixcclxuICAgICAgICAgIFwiSGF2ZSBlbm91Z2ggc3BhY2UgYmV0d2VlbiBjb21wb25lbnRzLlwiLFxyXG4gICAgICAgICAgXCJNYWtlIHN1cmUgY2xpY2sgYXJlYXMgYXJlIGJpZyBlbm91Z2guXCJcclxuICAgICAgICBdLFxyXG4gICAgICAgIFwibW9yZUluZm9VcmxcIjogXCJodHRwOi8vd3d3LnBhcmtpbnNvbmZvcmJ1bmRldC5zZVwiLFxyXG4gICAgICAgIFwibW9yZUluZm9MaW5rVGV4dFwiIDogXCJQYXJraW5zb24ncyBBc3NvY2lhdGlvblwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwieWVsbG93Qmx1ZUNvbG9yQmxpbmRuZXNzXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGF0aW9uIGFjdGl2ZSFcIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJZZWxsb3ctYmx1ZSBjb2xvciBibGluZG5lc3NcIixcclxuICAgICAgICBcImZhY3RcIjogXCJQZW9wbGUgd2l0aCBsb3dlcmVkIGNvbG9yIHZpc2lvbiBoYXZlIGRpZmZpY3VsdHkgZGlzdGluZ3Vpc2hpbmcgc29tZSBvciBhbGwgY29sb3JzLiBZZWxsb3ctYmx1ZSBjb2xvciBibGluZG5lc3MgKFRyaXRhbm9waWEpIGlzIHJhcmUuIFRoZSBuYW1lIGNhbiBiZSBtaXNsZWFkaW5nLiBJdCdzIG5vdCB0aGUgY29sb3JzIHllbGxvdyBhbmQgYmx1ZSB0aGF0IGFyZSBjb25mdXNlZCBidXQgYmx1ZSB3aXRoIGdyZWVuIGFuZCB5ZWxsb3cgd2l0aCBwdXJwbGUuXCIsXHJcbiAgICAgICAgXCJsaXN0SXRlbXNcIjogW1xyXG4gICAgICAgICAgXCJEbyBub3QgdXNlIGNvbG9yIGFzIHRoZSBvbmx5IHdheSB0byBjb252ZXkgaW5mb3JtYXRpb24sIGluZGljYXRlIGFuIGFjdGlvbiBvciBpZGVudGlmeSBhbiBlbGVtZW50LiBGb3IgZXhhbXBsZSwgZG8gbm90IG1hcmsgYW4gaW5jb3JyZWN0IGZvcm0gZmllbGQgd2l0aCBhIHJlZCBib3JkZXIgb25seSwgYWxzbyBzdXBwbGVtZW50IHdpdGggYSB0ZXh0IGFuZCBwcmVmZXJhYmx5IGFuIGljb24uXCIsXHJcbsKgwqDCoMKgwqDCoMKgwqDCoMKgXCJDb25zaWRlciBvZmZlcmluZyBhIGhpZ2ggY29udHJhc3QgbW9kZS5cIlxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJtb3JlSW5mb1VybFwiOiBcImh0dHBzOi8vc3Yud2lraXBlZGlhLm9yZy93aWtpL0RlZmVrdF9mJUMzJUE0cmdzZWVuZGVcIixcclxuICAgICAgICBcIm1vcmVJbmZvTGlua1RleHRcIiA6IFwiV2lraXBlZGlhIGFib3V0IGRlZmVjdGl2ZSBjb2xvciB2aXNpb25cIlxyXG4gICAgICB9LFxyXG4gICAgICBcInJlZEdyZWVuQ29sb3JCbGluZG5lc3NcIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsYXRpb24gYWN0aXZlIVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIlJlZC1ncmVlbiBjb2xvciBibGluZG5lc3NcIixcclxuICAgICAgICBcImZhY3RcIjogXCJQZW9wbGUgd2l0aCBsb3dlcmVkIGNvbG9yIHZpc2lvbiBoYXZlIGRpZmZpY3VsdHkgZGlzdGluZ3Vpc2hpbmcgc29tZSBvciBhbGwgY29sb3JzLiBSZWQtZ3JlZW4gY29sb3IgYmxpbmRuZXNzIChQcm90YW5vcGlhIGFuZCBEZXV0ZXJhbm9waWEpIGlzIHRoZSBtb3N0IGNvbW1vbiB0eXBlIG9mIGNvbG9yIGJsaW5kbmVzcy4gSXQgaXMgbW9yZSBjb21tb24gYW1vbmcgbWVuIHRoYW4gd29tZW4uIFBlb3BsZSB3aXRoIHJlZC1ncmVlbiBjb2xvciBibGluZG5lc3MgaGF2ZSBkaWZmaWN1bHR5IGRpc3Rpbmd1aXNoaW5nIHRoZSBjb2xvcnMgcmVkLCBncmVlbiwgYnJvd24gYW5kIG9yYW5nZS5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkRvIG5vdCB1c2UgY29sb3IgYXMgdGhlIG9ubHkgd2F5IHRvIGNvbnZleSBpbmZvcm1hdGlvbiwgaW5kaWNhdGUgYW4gYWN0aW9uIG9yIGlkZW50aWZ5IGFuIGVsZW1lbnQuIEZvciBleGFtcGxlLCBkbyBub3QgbWFyayBhbiBpbmNvcnJlY3QgZm9ybSBmaWVsZCB3aXRoIGEgcmVkIGJvcmRlciBvbmx5LCBhbHNvIHN1cHBsZW1lbnQgd2l0aCBhIHRleHQgYW5kIHByZWZlcmFibHkgYW4gaWNvbi5cIixcclxuwqDCoMKgwqDCoMKgwqDCoMKgwqBcIkNvbnNpZGVyIG9mZmVyaW5nIGEgaGlnaCBjb250cmFzdCBtb2RlLlwiXHJcbiAgICAgICAgXSxcclxuICAgICAgICBcIm1vcmVJbmZvVXJsXCI6IFwiaHR0cHM6Ly9zdi53aWtpcGVkaWEub3JnL3dpa2kvRGVmZWt0X2YlQzMlQTRyZ3NlZW5kZVwiLFxyXG4gICAgICAgIFwibW9yZUluZm9MaW5rVGV4dFwiIDogXCJXaWtpcGVkaWEgYWJvdXQgZGVmZWN0aXZlIGNvbG9yIHZpc2lvblwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiZmFyc2lnaHRlZG5lc3NcIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsYXRpb24gYWN0aXZlIVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIkZhci1zaWdodGVkbmVzc1wiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIkZhci1zaWdodGVkbmVzcyAoSHlwZXJvcGlhKSBpcyBvbmUgb2YgdGhlIG1vc3QgY29tbW9uIHZpc3VhbCBpbXBhaXJtZW50cy4gUGVvcGxlIHdpdGggSHlwZXJvcGlhIGhhdmUgZGlmZmljdWx0eSBmb2N1c2luZyBvbiBvYmplY3RzIGF0IGNsb3NlIHJhbmdlIHdoaWNoIG1ha2VzIHRoZW0gYXBwZWFyIGJsdXJyeS5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkF2b2lkIHRleHQgaW4gc21hbGwgZm9udCBzaXplcyBhbmQgbG9uZyB0ZXh0cy4gVXNlIHByb3BlciBzcGFjaW5nIGFuZCBsaW5lIGhlaWdodC5cIiwgIFxyXG4gICAgICAgICAgXCJNYWtlIHN1cmUgdGhlIHdlYnNpdGUgY2FuIGJlIHpvb21lZCB0byBhdCBsZWFzdCAyMDAlLlwiLFxyXG4gICAgICAgICAgXCJPZmZlciBhIHRleHQgdG8gc3BlZWNoIHJlYWRlci5cIlxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgXCJtb3JlSW5mb1VybFwiOiBcImh0dHBzOi8vd2ViYnJpa3RsaW5qZXIuc2Uvci8zOS1nZS13ZWJicGxhdHNlbi1lbi1nb2QtbGFzYmFyaGV0L1wiLFxyXG4gICAgICAgIFwibW9yZUluZm9MaW5rVGV4dFwiIDogXCJHb29kIHJlYWRhYmlsaXR5XCJcclxuICAgICAgfSxcclxuICAgICAgXCJ0b3RhbENvbG9yQmxpbmRuZXNzXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGF0aW9uIGFjdGl2ZSFcIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJUb3RhbCBjb2xvciBibGluZG5lc3NcIixcclxuICAgICAgICBcImZhY3RcIjogXCJQZW9wbGUgd2l0aCBsb3dlcmVkIGNvbG9yIHZpc2lvbiBoYXZlIGRpZmZpY3VsdHkgZGlzdGluZ3Vpc2hpbmcgc29tZSBvciBhbGwgY29sb3JzLiBUb3RhbCBjb2xvciBibGluZG5lc3MgKE1vbm9jaHJvbWF0aWMgLyBBY2hyb21hdG9wc3kpIGlzIHZlcnkgcmFyZS4gUGVvcGxlIHdpdGggdGhpcyB2aXN1YWwgaW1wYWlybWVudCBjYW4gbm90IHBlcmNpZXZlIGFueSBjb2xvcnMsIG9ubHkgZGlmZmVyZW50IHNoYWRlcyBvZiBncmF5LlwiLFxyXG4gICAgICAgIFwibGlzdEl0ZW1zXCI6IFtcclxuICAgICAgICAgIFwiRG8gbm90IHVzZSBjb2xvciBhcyB0aGUgb25seSB3YXkgdG8gY29udmV5IGluZm9ybWF0aW9uLCBpbmRpY2F0ZSBhbiBhY3Rpb24gb3IgaWRlbnRpZnkgYW4gZWxlbWVudC4gRm9yIGV4YW1wbGUsIGRvIG5vdCBtYXJrIGFuIGluY29ycmVjdCBmb3JtIGZpZWxkIHdpdGggYSByZWQgYm9yZGVyIG9ubHksIGFsc28gc3VwcGxlbWVudCB3aXRoIGEgdGV4dCBhbmQgcHJlZmVyYWJseSBhbiBpY29uLlwiLFxyXG7CoMKgwqDCoMKgwqDCoMKgwqDCoFwiQ29uc2lkZXIgb2ZmZXJpbmcgYSBoaWdoIGNvbnRyYXN0IG1vZGUuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwidHVubmVsVmlzaW9uXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGF0aW9uIGFjdGl2ZSEgbW92ZSB0aGUgbW91c2UgcG9pbnRlciBvbiB0aGUgd2ViIHBhZ2UgYW5kIHNlZSB3aGF0J3MgaGFwcGVuaW5nLlwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIlR1bm5lbCBWaXNpb25cIixcclxuICAgICAgICBcImZhY3RcIjogXCJXaGF0IGlzIGNvbW1vbmx5IGNhbGxlZCBUdW5uZWwgVmlzaW9uIGlzIGxvc3Mgb2YgcGVyaXBoZXJhbCB2aXNpb24uIFRoaXMgbWF5IGJlIGJlY2F1c2UgdGhlIHBlcnNvbiBzdWZmZXJzIGZyb20gYSBkaXNlYXNlIHRoYXQgYWZmZWN0cyB0aGUgY2VsbHMgaW4gdGhlIGV5ZSwgYnV0IG1heSBhbHNvIG9jY3VyIHRlbXBvcmFyaWx5IGR1ZSB0byBzdHJlc3Mgb3IgZGVwcmVzc2lvbi5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkF2b2lkIHRleHQgaW4gc21hbGwgZm9udCBzaXplcyBhbmQgbG9uZyB0ZXh0cy4gVXNlIHByb3BlciBzcGFjaW5nIGFuZCBsaW5lIGhlaWdodC5cIixcclxuICAgICAgICAgIFwiTWFrZSBzdXJlIHRoZSB3ZWJzaXRlIGNhbiBiZSB6b29tZWQgdG8gYXQgbGVhc3QgMjAwJS5cIixcclxuICAgICAgICAgIFwiT2ZmZXIgYSB0ZXh0IHRvIHNwZWVjaCByZWFkZXIuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIFwic3Vuc2hpbmVcIjpcclxuICAgICAge1xyXG4gICAgICAgIFwic2ltdWxhdGlvblN0YXR1c1wiOiBcIlNpbXVsYXRpb24gYWN0aXZlIVwiLFxyXG4gICAgICAgIFwiaGVhZGluZ1wiOiBcIlN1bnNoaW5lXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiTG9yZW0gaXBzdW1cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkxvcmVtIGlwc3VtLlwiLFxyXG4gICAgICAgICAgXCJMb3JlbSBpcHN1bS5cIixcclxuICAgICAgICAgIFwiTG9yZW0gaXBzdW1cIlxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgXCJjb25jZW50cmF0aW9uXCI6XHJcbiAgICAgIHtcclxuICAgICAgICBcInNpbXVsYXRpb25TdGF0dXNcIjogXCJTaW11bGF0aW9uIGFjdGl2ZSFcIixcclxuICAgICAgICBcImhlYWRpbmdcIjogXCJDb25jZW50cmF0aW9uXCIsXHJcbiAgICAgICAgXCJmYWN0XCI6IFwiRXZlcnlvbmUgY2FuIGhhdmUgYSBoYXJkIHRpbWUgY29uY2VudHJhdGluZywgYnV0IGZvciBzb21lIGl0IGNhbiBiZSBhIGJpZyBwcm9ibGVtIGluIGV2ZXJ5ZGF5IGxpZmUuIERpc2FiaWxpdGllcyBsaWtlIEFESEQgYW5kIEF1dGlzbSBjYW4gY2F1c2UgZGlmZmljdWx0eSBpbiBoYW5kbGluZyBpbXByZXNzaW9ucywgc29ydGluZyBpbmZvcm1hdGlvbiBhbmQgc2Vuc2l0aXZpdHkgdG8gc291bmQuXCIsICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkdpdmUgdGhlIHdlYnNpdGUgYSBzaW1wbGUgYW5kIGNsZWFuIGRlc2lnbi5cIixcclxuICAgICAgICAgIFwiQmUgY2FyZWZ1bCB3aXRoIGFuaW1hdGlvbnMgYW5kIHN0cm9uZyBjb2xvcnMuXCIsXHJcbiAgICAgICAgICBcIkF2b2lkIGhhdmluZyB0b28gbXVjaCBjb250ZW50IG9uIHRoZSBzYW1lIHBhZ2UuXCIsXHJcbiAgICAgICAgICBcIk9mZmVyIGltYWdlLCBhdWRpbyBhbmQgdmlkZW8gYWxlcm5hdGl2ZXMgdG8gdGV4dCBjb250ZW50LlwiXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBcInNtYWxsVm9jYWJ1bGFyeVwiOlxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzaW11bGF0aW9uU3RhdHVzXCI6IFwiU2ltdWxhdGlvbiBhY3RpdmUhXCIsXHJcbiAgICAgICAgXCJoZWFkaW5nXCI6IFwiU21hbGwgdm9jYWJ1bGFyeVwiLFxyXG4gICAgICAgIFwiZmFjdFwiOiBcIkEgbGFyZ2UgcGFydCBvZiB0aGUgd29ybGQncyBwb3B1bGF0aW9uIGNhbid0IHJlYWQgYXQgYWxsIGFuZCBtYW55IGFkdWx0cyBkb24ndCByZWFkIGFzIHdlbGwgYXMgZXhwZWN0ZWQgYWZ0ZXIgZmluaXNoaW5nIGdyYWRlIHNjaG9vbC5cIixcclxuICAgICAgICBcImxpc3RJdGVtc1wiOiBbXHJcbiAgICAgICAgICBcIkF2b2lkIGRpZmZpY3VsdCB3b3JkcyBhbmQgdGVybXMuXCIsXHJcbiAgICAgICAgICBcIk9mZmVyIGVhc3kgdG8gcmVhZCB0ZXh0cywgaW1hZ2VzLCB2aWRlbyBvciBhdWRpbyBhbHRlcm5hdGl2ZXMuXCIsXHJcbiAgICAgICAgICBcIk9mZmVyIHRleHRzIGluIGRpZmZlcmVudCBsYW5ndWFnZXMuXCJcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIlVJXCI6IHtcclxuICAgICAgXCJzZWxlY3RTaW11bGF0aW9uXCI6IFwiU2VsZWN0IHNpbXVsYXRpb246XCIsXHJcbiAgICAgIFwicmVzZXRcIjogXCJSZXNldFwiLFxyXG4gICAgICBcImFkdmljZVwiOiBcIlRoaW5rIGFib3V0IHRoaXNcIixcclxuICAgICAgXCJtb3JlSW5mb1wiOiBcIk1vcmUgaW5mb3JtYXRpb25cIixcclxuICAgICAgXCJzaWdodFwiOiBcIlNpZ2h0XCIsXHJcbiAgICAgIFwidG90YWxDb2xvckJsaW5kbmVzc1wiOiBcIlRvdGFsIGNvbG9yIGJsaW5kbmVzc1wiLFxyXG4gICAgICBcInllbGxvd0JsdWVDb2xvckJsaW5kbmVzc1wiOiBcIlllbGxvdy1CbHVlIGNvbG9yIGJsaW5kbmVzc1wiLCAgICBcclxuICAgICAgXCJyZWRHcmVlbkNvbG9yQmxpbmRuZXNzXCI6IFwiUmVkLUdyZWVuIGNvbG9yIGJsaW5kbmVzc1wiLFxyXG4gICAgICBcImZhcnNpZ2h0ZWRuZXNzXCI6IFwiRmFyLXNpZ2h0ZWRuZXNzXCIsXHJcbiAgICAgIFwidHVubmVsVmlzaW9uXCI6IFwiVHVubmVsIHZpc2lvblwiLFxyXG4gICAgICBcIm1vYmlsaXR5XCI6IFwiTW9iaWxpdHlcIixcclxuICAgICAgXCJwYXJraW5zb25zXCI6IFwiUGFya2luc29uc1wiLFxyXG4gICAgICBcInJlYWRBbmRXcml0ZVwiOiBcIlJlYWQgYW5kIHdyaXRlXCIsXHJcbiAgICAgIFwiZHlzbGV4aWFcIjogXCJEeXNsZXhpYVwiLFxyXG4gICAgICBcInNtYWxsVm9jYWJ1bGFyeVwiOiBcIlNtYWxsIHZvY2FidWxhcnlcIixcclxuICAgICAgXCJjb25jZW50cmF0aW9uXCI6IFwiQ29uY2VudHJhdGlvblwiLFxyXG4gICAgICBcImNoYW5nZVNldHRpbmdzXCI6IFwiQ2hhbmdlIHNldHRpbmdzXCIsXHJcbiAgICAgIFwic2VsZWN0TGFuZ3VhZ2VcIjogXCJTZWxlY3QgbGFuZ3VhZ2VcIixcclxuICAgICAgXCJzYXZlU2V0dGluZ3NcIjogXCJTYXZlIHNldHRpbmdzXCIsXHJcbiAgICAgIFwiY2FuY2VsXCI6IFwiQ2FuY2VsXCIsXHJcbiAgICAgIFwic2ltdWxhdGlvbnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaGVhZGluZ1wiOiBcIlNpZ2h0XCIsXHJcbiAgICAgICAgICBcImNob2ljZXNcIjogW1xyXG4gICAgICAgICAgICB7IFwidG90YWxDb2xvckJsaW5kbmVzc1wiOiBcIlRvdGFsIGNvbG9yIGJsaW5kbmVzc1wiIH0sXHJcbiAgICAgICAgICAgIHsgXCJ5ZWxsb3dCbHVlQ29sb3JCbGluZG5lc3NcIjogXCJZZWxsb3ctQmx1ZSBjb2xvciBibGluZG5lc3NcIiB9LFxyXG4gICAgICAgICAgICB7IFwicmVkR3JlZW5Db2xvckJsaW5kbmVzc1wiOiBcIlJlZC1HcmVlbiBjb2xvciBibGluZG5lc3NcIiB9LFxyXG4gICAgICAgICAgICB7IFwiZmFyc2lnaHRlZG5lc3NcIjogXCJGYXItc2lnaHRlZG5lc3NcIiB9LFxyXG4gICAgICAgICAgICB7IFwidHVubmVsVmlzaW9uXCI6IFwiVHVubmVsIHZpc2lvblwiIH0sXHJcbiAgICAgICAgICAgIHsgXCJzdW5zaGluZVwiOiBcIlN1bnNoaW5lXCIgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJoZWFkaW5nXCI6IFwiTW9iaWxpdHlcIixcclxuICAgICAgICAgIFwiY2hvaWNlc1wiOiBbIFxyXG4gICAgICAgICAgICB7IFwicGFya2luc29uc1wiOiBcIlBhcmtpbnNvbnNcIiB9XHJcbiAgICBcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJoZWFkaW5nXCI6IFwiUmVhZCBhbmQgd3JpdGVcIixcclxuICAgICAgICAgIFwiY2hvaWNlc1wiOiBbXHJcbiAgICAgICAgICAgIHsgXCJkeXNsZXhpYVwiOiBcIkR5c2xleGlhXCIgfSxcclxuICAgICAgICAgICAgeyBcInNtYWxsVm9jYWJ1bGFyeVwiOiBcIlNtYWxsIHZvY2FidWxhcnlcIiB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImhlYWRpbmdcIjogXCJDb25jZW50cmF0aW9uXCIsXHJcbiAgICAgICAgICBcImNob2ljZXNcIjogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaGVhZGluZ1wiOiBcIk1lbW9yeVwiLFxyXG4gICAgICAgICAgXCJjaG9pY2VzXCI6IFtdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBsb2FkZWRTaW11bGF0aW9ucyA9IFtdO1xuXG5mdW5jdGlvbiBsb2FkKG5hbWUsIHN1Yk5hbWUsIGNhbGxiYWNrKSB7XG4gIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uICh0YWJzKSB7XG4gICAgdmFyIGFjdGl2ZVRhYiA9IHRhYnNbMF0sXG4gICAgICAgIHNjcmlwdEZpbGUgPSBzdWJOYW1lID8gJ3NpbXVsYXRpb25zLycgKyBuYW1lICsgJy8nICsgc3ViTmFtZSArICcvY29udGVudC5qcycgOiAnc2ltdWxhdGlvbnMvJyArIG5hbWUgKyAnL2NvbnRlbnQuanMnO1xuXG4gICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdChhY3RpdmVUYWIuaWQsIHsgZmlsZTogc2NyaXB0RmlsZSB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2FkZWRTaW11bGF0aW9ucy5wdXNoKG5hbWUpO1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG5hbWUsIHN1Yk5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc3RhcnQobmFtZSwgc3ViTmFtZSkge1xuICBpZiAobG9hZGVkU2ltdWxhdGlvbnMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgICAgdmFyIGFjdGl2ZVRhYiA9IHRhYnNbMF07XG5cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKGFjdGl2ZVRhYi5pZCwgeyBhY3Rpb246ICdzdGFydFNpbXVsYXRpb24nLCBzaW11bGF0aW9uOiBuYW1lLCBzdWJTaW11bGF0aW9uOiBzdWJOYW1lIH0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxvYWQobmFtZSwgc3ViTmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgZnVuY3Rpb24gKHRhYnMpIHtcbiAgICAgICAgdmFyIGFjdGl2ZVRhYiA9IHRhYnNbMF07XG5cbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoYWN0aXZlVGFiLmlkLCB7IGFjdGlvbjogJ3N0YXJ0U2ltdWxhdGlvbicsIHNpbXVsYXRpb246IG5hbWUsIHN1YlNpbXVsYXRpb246IHN1Yk5hbWUgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9wKG5hbWUsIHN1Yk5hbWUpIHtcbiAgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgZnVuY3Rpb24gKHRhYnMpIHtcbiAgICB2YXIgYWN0aXZlVGFiID0gdGFic1swXTtcblxuICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKGFjdGl2ZVRhYi5pZCwgeyBhY3Rpb246ICdzdG9wU2ltdWxhdGlvbicsIHNpbXVsYXRpb246IG5hbWUsIHN1YlNpbXVsYXRpb246IHN1Yk5hbWUgfSk7XG4gIH0pO1xufVxuXG5leHBvcnRzLnN0YXJ0ID0gc3RhcnQ7XG5leHBvcnRzLnN0b3AgPSBzdG9wO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2ltdWxhdGlvbkxvYWRlci5qcy5tYXBcbiJdfQ==
