/*global $:false */
/*global console:false */
window.onload = function()
{
  'use strict';
  var AudiofileSDK = (function(){
    function AudiofileSDK()
    {
    }
  
    AudiofileSDK.prototype.parser = function(docId)
    {
      return new AudiofileParser(docId);
    };
  
    return AudiofileSDK;
  })();

  var AudiofileParser = (function(){
    function AudiofileParser(docId)
    {
      var title = $('#' + docId + ' div[data-title]')[0];
      var creator = $('#' + docId + ' div[data-creator]')[0];
      var return_obj = {
        'title':$(title).attr('data-title'),
        'creator':$(creator).attr('data-creator'),
        'bpm':$(creator).attr('data-bpm'),
        'key':$(creator).attr('data-key'),
        'measures':{}
      };
      $('#' + docId + ' div[data-measure]').each(function(index){
        return_obj.measures[index] = {};
        $(this).children().each(function(indx){
          return_obj.measures[index][indx] = {};
          if($(this).attr('data-chord') == 'true')
          {
            $(this).children().each(function(ind)
            {
              return_obj.measures[index][indx]['note' + ind] = {};
              return_obj.measures[index][indx]['note' + ind].note = $(this).attr('data-note');
              return_obj.measures[index][indx]['note' + ind].pitch = $(this).attr('data-pitch');
              return_obj.measures[index][indx]['note' + ind].octave = $(this).attr('data-octave');
            });
          }
          else
          {
            return_obj.measures[index][indx].note = $(this).attr('data-note');
            return_obj.measures[index][indx].pitch = $(this).attr('data-pitch');
            return_obj.measures[index][indx].octave = $(this).attr('data-octave');
          }
        });
      });
      return return_obj;
    }

    return AudiofileParser;
  })();
  
  var audiofile_sdk = new AudiofileSDK();
  console.log(audiofile_sdk.parser('doc1'));
};
