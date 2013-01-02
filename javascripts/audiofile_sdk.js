/*global $:false */
/*global console:false */
'use strict';

// All Objects in the AudioFile Framework have AFObject as their final prototype before the JS Object
var AFObject = (function()
{
  function AFObject()
  {}
  
  return AFObject;
})();

var AFController = (function()
{
  function AFController()
  {}

  AFController.prototype = Object.create(AFObject.prototype);

  // All Application controllers have AFController as their prototype and should
  // implement a method for all 4 stages of the Application Lifecycle
  AFController.prototype.onAFApplicationStart = function()
  {
  };

  AFController.prototype.onAFApplicationStop = function()
  {
  };

  AFController.prototype.onAFApplicationPause = function()
  {
  };

  AFController.prototype.onAFApplicationUnpause = function()
  {
  };

  return AFController;
})();

var AFCore = (function()
{
  // This is the first and only Object created from the audiofile_sdk index.html file
  function AFCore()
  {
    var afCoreController = new AFCoreController();
    afCoreController.onAFApplicationStart();
  }

  AFCore.prototype = Object.create(AFObject.prototype);

  return AFCore;
})();

var AFCoreController = (function()
{
  // The Controller which runs the Lifecycle of the AudioFile Framework/SDK
  function AFCoreController()
  {}

  AFCoreController.prototype = new AFController();

  AFCoreController.prototype.onAFApplicationStart = function()
  {
    var afApplicationManager = new AFApplicationManager();
    afApplicationManager.startAFApplication({
      "controller" : "AudioFileDashboard"
    });
  };

  return AFCoreController;
})();

var AFApplicationManager = (function()
{
  // Manages the Applications. Creates new AFApplications
  function AFApplicationManager()
  {
    this.activeApplication = null;
    this.hasActiveApplication = false;
  }

  AFApplicationManager.prototype = Object.create(AFObject.prototype);

  AFApplicationManager.prototype.startAFApplication = function(startAppJson)
  {
    console.dir(Object.create(AFApplication));
    if(!this.activeApplication)
    {
        this.activeApplication = Object.create(AFApplication);
        this.hasActiveApplication = true;
    }
  };

  AFApplicationManager.prototype.stopAFApplication = function()
  {
  };

  AFApplicationManager.prototype.pauseAFApplication = function()
  {
  };

  AFApplicationManager.prototype.unpauseAFApplication = function()
  {
  };

  return AFApplicationManager;
})();

var AFWebWorker = (function()
{
  function AFWebWorker(onAFApplicationStartFuncStr)
  {
    //console.log(onAFApplicationStartFuncStr);
    var blob = new AFBlob(["self.onmessage=function(e){postMessage('Worker: '+e.data);}"]);
    var afURL = new AFURL();

    this.webWorker = new Worker(afURL.createObjectURL(blob.afBlob));
    //this.webWorker = new Worker('applications/' + applicationController + '/controllers/' + applicationController + 'Controller.js');
  }

  AFWebWorker.prototype = Object.create(AFObject.prototype);

  AFWebWorker.prototype.postMessage = function(message)
  {
    this.webWorker.postMessage(message);
  };

  AFWebWorker.prototype.onMessage = function(message)
  {
    //console.log('Response: ' + message);
  };

  return AFWebWorker;
})();

var AFBlob = (function()
{
  function AFBlob(scriptArray)
  {
    this.afBlob = new Blob(scriptArray);
  }

  AFBlob.prototype = Object.create(AFObject.prototype);

  return AFBlob;
})();

var AFForm = Object.create(AFObject, {
  action : {
    congifurable : true,
    enumerable   : true,
    value        : null,
    writable     : true
  },
  method : {
    congifurable : true,
    enumerable   : true,
    value        : 'POST',
    writable     : true
  }
});

var AFInputField = Object.create(AFObject.prototype);

var AFTextInputField = Object.create(AFInputField, {
  autofocus   : {
    congifurable : true,
    enumerable   : true,
    value        : false,
    writable     : true
  },
  placeholder : {
    congifurable : true,
    enumerable   : true,
    value        : null,
    writable     : true
  },
  type        : {
    congifurable : true,
    enumerable   : true,
    value        : 'text',
    writable     : true
  },
  value       : {
    congifurable : true,
    enumerable   : true,
    value        : null,
    writable     : true
  }
});

var AFPasswordInputField = Object.create(AFTextInputField, {
  type        : {
    congifurable : true,
    enumerable   : true,
    value        : 'password',
    writable     : true
  }
});

var AFEmailInputField= Object.create(AFTextInputField, {
  type        : {
    congifurable : true,
    enumerable   : true,
    value        : 'email',
    writable     : true
  }
});

var AFURL = (function()
{
  function AFURL()
  {
  }

  AFURL.prototype = Object.create(AFObject.prototype);

  AFURL.prototype.createObjectURL = function(afBlob)
  {
    return URL.createObjectURL(afBlob);
  };

  return AFURL;
})();


var AFApplication = Object.create(AFObject, {
  applicationControllerName : {
    congifurable : true,
    enumerable   : true,
    value        : null,
    writable     : true
  }
});

AFApplication.prototype.getApplicationManifest = function()
{
  var ctx = this;
  // $.getJSON grabs the manifest which has the app's controller's name
  $.getJSON('applications/' + this.applicationControllerName + '/config/AFManifest.json', function(data)
  {
    ctx.applicationManifest = data;
    ctx.getApplicationController();
  });
};

AFApplication.prototype.getApplicationController = function()
{
//return AFTextInputField.prototype.constructor.call(autofocus, placeholder);
  var ctx = this;
  // need to get a pointer to the js that gets executed by $.getScript
  $.getScript('applications/' + this.applicationControllerName + '/controllers/' + this.applicationControllerName + 'Controller.js', function(data)
  {
    ctx.applicationController = new window[ctx.applicationControllerName + 'Controller']();
    ctx.getApplicationDOM();
  });
};

AFApplication.prototype.getApplicationDOM = function()
{
  var ctx = this;
  $.get('applications/' + this.applicationControllerName + '/views/index.html', function(data)
  {
    ctx.applicationDOM = data;
    //ctx.createWebWorker();
  });
};

AFApplication.prototype.createWebWorker = function()
{
  var onAFApplicationStartFuncStr = this.applicationController.onAFApplicationStart.toString();
  var afWebWorker = new AFWebWorker(onAFApplicationStartFuncStr);
  afWebWorker.postMessage('Test');

  afWebWorker.webWorker.onmessage = function(event)
  {
    afWebWorker.onMessage(event.data);
  };
  //this.startApplication(this.applicationController);
};

AFApplication.prototype.startApplication = function(applicationController)
{
  // ApplicatoinController also got created with the getScript above. Need to figure that out
  // Filed as a ticket here: https://github.com/cgcardona/audiofile_sdk/issues/1
  applicationController.onAFApplicationStart();

};

AFApplication.prototype.stopApplication = function()
{
};

AFApplication.prototype.pauseApplication = function()
{
};

AFApplication.prototype.unpauseApplication = function()
{
};

var AFUI = (function()
{
  function AFUI(context)
  {
    this.ctx = context;
  }

  AFUI.prototype.buildDom = function(domModules)
  {
    var that = this;
    $(domModules).each(function(indx, elmnt){
      $('#' + this).html(that.ctx[elmnt].buildDom());
      $('#' + this).html(that.ctx[elmnt].attachEventListeners());
    });
  };

  return AFUI;
})();

var AFSDK = (function()
{
  function AFSDK(settings)
  {
    var domModules = [];

    if(settings.modules.ga === true)
    {
      this.AFGeneticsLab = new AFGeneticsLab();
      this.AFUIGeneticsLab = new AFUIGeneticsLab(this);
      domModules.push('AFUIGeneticsLab');
    }

    this.UI = new FUI(this);
    this.UI.buildDom(domModules);

    //if(settings.modules.parser === true)
    //  this.Parser  = new AFParser();

    //if(settings.modules.painter === true)
    //  this.Painter = new AFPainter();

    //if(settings.modules.speaker === true)
    //  this.Speaker = new AFSpeaker();
  }

  return AFSDK;
})();

var AFGeneticsLab = (function()
{
  function AFGeneticsLab()
  {
  }

  AFGeneticsLab.prototype.updateSettings = function(settings)
  {
    this.gaGSInput     = settings.gaGSInput;
    this.gaGCInput     = settings.gaGCInput;
    this.gaDNABitCount = settings.gaDNABitCount;
    this.gaPSCount     = settings.gaPSCount;
    this.gaDSSteps     = settings.gaDSSteps;
  };

  AFGeneticsLab.prototype.generateDNA = function()
  {
    var dnaArray = [];
    for(var x = 0; x < this.gaGSInput; x++)
    {
      var tmpString = '';
      for(var i = 0; i < this.gaDNABitCount; i++)
        tmpString += Math.floor((Math.random() * this.gaPSCount));

      dnaArray.push(tmpString);
    }

    return dnaArray;
  };

  AFGeneticsLab.prototype.gradeDNA = function(dnaArray)
  {
    $(dnaArray).each(function(indx, elmnt){
      var soundState = true;
      var tone = 0;

      for(var p = 0; p < elmnt.length; p++)
      {
      }
    });
  };

  return AFGeneticsLab;
})();

var AFUIGeneticsLab = (function()
{
  function AFUIGeneticsLab(context)
  {
    this.ctx = context;
  }

  AFUIGeneticsLab.prototype.buildDom = function()
  {
    var container = $('<div>');
    var setupFormContainer = $('<form>').attr('id', 'gaForm');

    var setupFormHeader = $('<h1>Genetics Lab</h1>');
    $(setupFormContainer).append(setupFormHeader);

    var generationSizeInput = $('<p>Generations Size: <input id="gaGSInput" placeholder="Generation Size"></p>');
    $(setupFormContainer).append(generationSizeInput);

    var generationCountInput = $('<p>Generation Count: <input id="gaGCInput" placeholder="Generation Count"></p>');
    $(setupFormContainer).append(generationCountInput);

    var dnaBitCount = $('<p>DNA Bit Count: <input id="gaDNABitCount" placeholder="DNA Bit Count"></p>');
    $(setupFormContainer).append(dnaBitCount);

    var potentialStepCount = $('<p>Potential Step Count: <input id="gaPSCount" placeholder="Potential Step Count"></p>');
    $(setupFormContainer).append(potentialStepCount);

    var desiredScale = $('<p>Desired Scale Steps: <input id="gaDSSteps" placeholder="Desired Scale Steps"></p>');
    $(setupFormContainer).append(desiredScale);

    var submitGAForm = $('<button id="gaSubmit">Generate DNA</button>');
    $(setupFormContainer).append(submitGAForm);

    $(container).append(setupFormContainer);

    var dnaOutputContainer = $('<div></div>');
    var dnaList = $('<ol id="gaDNAList"></ol>');

    $(dnaOutputContainer).append(dnaList);
    $(container).append(dnaOutputContainer);

    $('#foobar').append(container);
    return container;
  };

  AFUIGeneticsLab.prototype.attachEventListeners = function()
  {
    var that = this;
    $('#gaSubmit').click(function(evnt) {
      that.generateDNA({
        gaGSInput     : parseInt($('#gaGSInput').val(), 10),
        gaGCInput     : parseInt($('#gaGCInput').val(), 10),
        gaDNABitCount : parseInt($('#gaDNABitCount').val(), 10),
        gaPSCount     : parseInt($('#gaPSCount').val(), 10),
        gaDSSteps     : $('#gaDSSteps').val(),
        gaSubmit      : parseInt($('#gaSubmit').val(), 10)
      });
      return false;
    });
  };

  AFUIGeneticsLab.prototype.generateDNA = function(settings)
  {
    this.ctx.AFGeneticsLab.updateSettings(settings);
    var dnaArray = this.ctx.AFGeneticsLab.generateDNA();
    var gradedDNA = this.ctx.AFGeneticsLab.gradeDNA(dnaArray);
    $(dnaArray).each(function(indx, elmnt){
      var listItem = $('<li>' + elmnt + '</li>');
      $('#gaDNAList').append(listItem);
    });
  };

  return AFUIGeneticsLab;
})();

var FUI = (function()
{
  function FUI(context)
  {
    this.ctx = context;
  }

  FUI.prototype.buildDom = function(domModules)
  {
    var that = this;
    $(domModules).each(function(indx, elmnt){
      $('#' + this).html(that.ctx[elmnt].buildDom());
      $('#' + this).html(that.ctx[elmnt].attachEventListeners());
    });
  };

  return FUI;
})();

var AFParser = (function()
{
  function AFParser()
  {
  }

  AFParser.prototype.parse = function(docId){
    var infoDiv = $('#' + docId + ' > div')[0];
    var return_obj = {
      'creator':$(infoDiv).attr('data-creator'),
      'title':$(infoDiv).attr('data-title'),
      'bpm':$(infoDiv).attr('data-bpm'),
      'key':$(infoDiv).attr('data-key'),
      'measures':{}
    };

    $('#' + docId + ' div[data-measure]').each(function(index)
    {
      return_obj.measures[index] = {};
      $(this).children().each(function(indx)
      {
        return_obj.measures[index][indx] = {};

        var outerEl = this;
        $(this.attributes).each(function(inex, el)
        {
          if(el.localName == 'data-chord')
          {
            $(outerEl).children().each(function(ind)
            {
              return_obj.measures[index][indx]['note' + ind] = {};
              return_obj.measures[index][indx]['note' + ind].note = this.getAttribute('data-note');
              return_obj.measures[index][indx]['note' + ind].pitch = this.getAttribute('data-pitch');
              return_obj.measures[index][indx]['note' + ind].octave = this.getAttribute('data-octave');
            });
          }
          else
          {
            return_obj.measures[index][indx].note = outerEl.getAttribute('data-note');
            return_obj.measures[index][indx].pitch = outerEl.getAttribute('data-pitch');
            return_obj.measures[index][indx].octave = outerEl.getAttribute('data-octave');
          }
        });
      });
    });
    return return_obj;
  };

  return AFParser;
})();

var AFPainter = (function()
{
  function AFPainter()
  {
  }
  
  AFPainter.prototype.paint = function(dataObj)
  {
  };

  return AFPainter;
})();

var AFSpeaker = (function()
{
  function AFSpeaker()
  {
  }
  
  AFSpeaker.prototype.speak = function(dataOb)
  {
  };

  return AFSpeaker;
})();
