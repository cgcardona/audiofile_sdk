/*global $:false */
/*global console:false */
var AFSDK = (function()
{
'use strict';
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
    this.gaGSInput     = settings.gaGSInput;
    this.gaGCInput     = settings.gaGCInput;
    this.gaDNABitCount = settings.gaDNABitCount;
    this.gaPSCount     = settings.gaPSCount
  };

  AFGeneticsLab.prototype.generateDNA = function()
  {
    var dnaArray = [];
    for(var x = 0; x < this.gaGSInput; x++)
    {
      var tmpString = '';
      for(var i = 0; i < (this.gaDNABitCount); i++)
        tmpString += Math.floor((Math.random() * this.gaPSCount));

      dnaArray.push(tmpString);
    }

    return dnaArray;
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

    var generationSizeInput = $('<p><input id="gaGSInput" placeholder="Generation Size"></p>');
    $(setupFormContainer).append(generationSizeInput);

    var generationCountInput = $('<p><input id="gaGCInput" placeholder="Generation Count"></p>');
    $(setupFormContainer).append(generationCountInput);

    var dnaBitCount = $('<p><input id="gaDNABitCount" placeholder="DNA Bit Count"></p>');
    $(setupFormContainer).append(dnaBitCount);

    var potentialStepCount = $('<p><input id="gaPSCount" placeholder="Potential Step Count"></p>');
    $(setupFormContainer).append(potentialStepCount);

    var submitGAForm = $('<button id="gaSubmit">Generate DNA</button>');
    $(setupFormContainer).append(submitGAForm);

    $(container).append(setupFormContainer);

    var dnaOutputContainer = $('<div>');
    var dnaList = $('<ol id="gaDNAList">');

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
        gaSubmit      : parseInt($('#gaSubmit').val(), 10),
      });
      return false;
    });
  };

  AFUIGeneticsLab.prototype.generateDNA = function(settings)
  {
    this.ctx.AFGeneticsLab.updateSettings(settings);
    var dnaArray = this.ctx.AFGeneticsLab.generateDNA();
    $(dnaArray).each(function(indx, elmnt){
      var listItem = $('<li>' + elmnt + '</li>');
      $('#gaDNAList').append(listItem);
    });
  };

  return AFUIGeneticsLab;
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
