/*global $:false */
/*global console:false */
'use strict';
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

  AFController.prototype = new AFObject();

  AFController.prototype.onAFApplicationStart = function()
  {
    console.log('AFController onAFApplicationStart called');
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
  function AFCore()
  {
    var afCoreController = new AFCoreController();
    afCoreController.onAFApplicationStart();
  }

  AFCore.prototype = new AFObject();

  return AFCore;
})();

var AFCoreController = (function()
{
  function AFCoreController()
  {}

  AFCoreController.prototype = new AFController();

  AFCoreController.prototype.onAFApplicationStart = function()
  {
    var afApplicationManager = new AFApplicationManager();
    afApplicationManager.startApplication({
      "title" : "startupApplication"
    });
    //return AFController.prototype.onAFApplicationStart.call(this);
  };

  return AFCoreController;
})();

var AFApplicationManager = (function()
{
  function AFApplicationManager()
  {
    this.activeApplication = false;
  }

  AFApplicationManager.prototype = new AFObject();

  AFApplicationManager.prototype.startApplication = function(applicationJson)
  {
    if(!this.activeApplication)
      {
        var afApplication = new AFApplication();
        var that = this;
        $.get('applications/' + applicationJson.title + '/index.html', function(data)
        {
          afApplication.setMarkup(data);
          afApplication.activeApplication = true;

          that.activeApplication = afApplication;
          var afUI = new AFUI();
          console.log(afApplication);
        });
      }
  };

  AFApplicationManager.prototype.stopApplication = function()
  {
  };

  AFApplicationManager.prototype.pauseApplication = function()
  {
  };

  AFApplicationManager.prototype.unpauseApplication = function()
  {
  };

  return AFApplicationManager;
})();

var AFApplication = (function()
{
  function AFApplication()
  {
    this.markup = null;
    this.activeApplication = false;
  }

  AFApplication.prototype = new AFObject();

  AFApplication.prototype.setMarkup = function(markup)
  {
    this.markup = markup;
  };

  return AFApplication;
})();

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

    this.UI = new AFUI(this);
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
  console.log(settings);
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
    console.log(this.gaDSSteps);
    $(dnaArray).each(function(indx, elmnt){
      var soundState = true;
      var tone = 0;

      for(var p = 0; p < elmnt.length; p++)
      {
        //console.log(elmnt[p]);
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
