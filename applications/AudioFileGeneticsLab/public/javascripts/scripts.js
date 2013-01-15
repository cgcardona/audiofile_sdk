/*jshint globalstrict:true*/
/*global $:false */
/*global _:false */
/*global console:false */
/*global window:false */
/*global document:false */
/*global Worker:false */
/*global CustomEvent:false */
/*global Blob:false */
/*global URL:false */
/*global AFGeneticsLab:false */
/*global AFAudioContext:false */
'use strict';
window.onload = function()
{
  var afGeneticsLab = Object.create(AFGeneticsLab);

  $('#gaSubmit').click(function(evnt){
    afGeneticsLab.setProperties({
      generationSize     : parseInt($('#generationSize').val(), 10),
      generationCount    : parseInt($('#generationCount').val(), 10),
      mutationPercentage : parseInt($('#mutationPercentage').val(), 10),
      dnaBitCount        : parseInt($('#dnaBitCount').val(), 10),
      dnaStepCount       : parseInt($('#dnaStepCount').val(), 10),
      scaleSteps         : $('input:radio[name=scales]').val().split(','),
      musicKey           : $('#keys').val(),
      octave             : $('#octave').val()
    });

    // create a generation of creatures
    var generationOfCreatures = afGeneticsLab.generateCreatures();

    // Because it's the first generation wrap their dna property in a span with a class
    _.each(generationOfCreatures, function(value, key){
      value.dna = $('<span class="root">' + value.dna + '</span>');
      value.parent1 = $('<span class="root">' + value.parent1 + '</span>');
      value.parent2 = $('<span class="root">' + value.parent2 + '</span>');
    }, this);

    // Evolve them and sort by fitness score
    var evolvedGenerationOfCreatures = afGeneticsLab.evolveDNA(generationOfCreatures);
    var sortedGenerationOfCreatures  = evolvedGenerationOfCreatures.sort(function(a,b){return a.fitness - b.fitness;}).reverse();

    // Wrap each creature in some markup to display on the screen
      console.log(sortedGenerationOfCreatures);
    $(sortedGenerationOfCreatures).each(function(indx, elmnt){
      var listItem = $('<li>');

      var domEls = [
        $('<p>Name: ' + elmnt.name + '</p>'),
        $('<p>Generation: ' + elmnt.generation + '</p>'),
        $('<p>DNA: </p>').append(elmnt.dna),
        $('<p>Fitness: ' + elmnt.fitness + '</p>'),
        $('<p>Notes: ' + elmnt.notes + '</p>'),
        $('<p>Parent1: </p>').append($('<a class="parent1DNA showParent" id="' + elmnt.parent1.name + '" href="#">' + elmnt.parent1.name + '</a>')),
        $('<p>Parent2: </p>').append($('<a class="parent2DNA showParent" id="' + elmnt.parent2.name + '" href="#">' + elmnt.parent2.name + '</a>')),
        $('<p></p>').append($('<a class="play" href="#">Play</a>')),
      ];

      $(domEls).each(function(idx, elt){
        $(listItem).append(elt);
      });

      $('#gaDNAList').append(listItem);
    });

    $('.showParent').click(function(e){
      return false;
    });

    $('.play').click(function(e){
      var afAudioContext = Object.create(AFAudioContext);
      afAudioContext.init(440);
      return false;
    });

    return false;
  });

  var elArr = [
    [
      'generationSize',
      'genSz'
    ],
    [
      'generationCount',
      'genCnt'
    ],
    [
      'mutationPercentage',
      'mutPct'
    ],
    [ 'dnaBitCount',
      'bitCnt'
    ],
    [
      'dnaStepCount',
      'stpCnt'
    ]
  ];

  $(elArr).each(function(indx, elmnt){
    $('#' + elmnt[0]).change(function(e){
      $('#' + elmnt[1]).text(e.srcElement.value);
    });
  });

};
