/*global $:false */
/*global console:false */
window.onload = function()
{
  'use strict';
  var AFSDK = (function(){
    function AFSDK()
    {
    }
  
    AFSDK.prototype.parse = function(docId)
    {
      return new AFParser(docId);
    };
  
    return AFSDK;
  })();

  var AFParser = (function(){
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

      $('#' + docId + ' div[data-measure]').each(function(index){
        return_obj.measures[index] = {};
        $(this).children().each(function(indx)
        {
          return_obj.measures[index][indx] = {};

          if(this.getAttribute('data-chord') == 'true')
          {
            $(this).children().each(function(ind)
            {
              return_obj.measures[index][indx]['note' + ind] = {};
              return_obj.measures[index][indx]['note' + ind].note = this.getAttribute('data-note');
              return_obj.measures[index][indx]['note' + ind].pitch = this.getAttribute('data-pitch');
              return_obj.measures[index][indx]['note' + ind].octave = this.getAttribute('data-octave');
            });
          }
          else
          {
            return_obj.measures[index][indx].note = this.getAttribute('data-note');
            return_obj.measures[index][indx].pitch = this.getAttribute('data-pitch');
            return_obj.measures[index][indx].octave = this.getAttribute('data-octave');
          }
        });
      });
      return return_obj;
    }

    return AFParser;
  })();
  
  var audiofile_sdk = new AFSDK();
  console.log(audiofile_sdk.parse('doc1'));
};
