/*global $:false */
/*global console:false */
window.onload = function()
{
  'use strict';
  var AFSDK = (function()
  {
    function AFSDK(settings)
    {
      if(settings.parser == true)
        this.Parser  = new AFParser();

      if(settings.painter == true)
        this.Painter = new AFPainter();

      if(settings.speaker == true)
        this.Speaker = new AFSpeaker();
    }
  
    return AFSDK;
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
    
    AFPainter.prototype.paint = function(dataOb)
    {
      console.log('coming to you live from the painter');
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
      console.log('speaker coming to you live');
    };

    return AFSpeaker;
  })();
  
  var audiofile_sdk = new AFSDK({
    parser  : true,
    painter : true,
    speaker : true
  });

  var dataObj = audiofile_sdk.Parser.parse('doc1');

  console.log(dataObj);
  audiofile_sdk.Painter.paint(dataObj);
  audiofile_sdk.Speaker.speak(dataObj);
};
