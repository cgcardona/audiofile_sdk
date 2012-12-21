/*global $:false */
/*global console:false */
window.onload = function()
{
  'use strict';
  var AFSDK = (function()
  {
    function AFSDK()
    {
    }
  
    AFSDK.prototype.parse = function(docId)
    {
      return new AFParser(docId);
    };
  
    AFSDK.prototype.paint = function(dataOb)
    {
      return new AFParser(docId);
    };
  
    return AFSDK;
  })();

  var AFParser = (function()
  {
    function AFParser(docId)
    {
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
    }

    return AFParser;
  })();

  var AFPainter = (function()
  {
    function AFPainter(dataOb)
    {
      console.log(dataObj);
    }

    return AFPainter;
  })();
  
  var audiofile_sdk = new AFSDK();
  var dataObj = audiofile_sdk.parse('doc1');

  console.log(audiofile_sdk.paint(dataObj));
};
