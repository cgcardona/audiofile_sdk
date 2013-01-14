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
      scaleSteps         : $('input:radio[name=scales]').val().split(',')
    });

    // create a generation of creatures
    var generationOfCreatures = afGeneticsLab.generateCreatures();

    // Because it's the first generation wrap their dna property in a span with a class
    _.each(generationOfCreatures, function(value, key){
      var rootSpan = $('<span class="root">' + value.dna + '</span>');
      value.dna    = rootSpan;
    }, this);

    // Evolve them and sort by fitness score
    var evolvedGenerationOfCreatures = afGeneticsLab.evolveDNA(generationOfCreatures);
    var sortedGenerationOfCreatures  = evolvedGenerationOfCreatures.sort(function(a,b){return a.fitness - b.fitness;}).reverse();

    // Wrap each creature in some markup to display on the screen
    $(sortedGenerationOfCreatures).each(function(indx, elmnt){
      var listItem = $('<li>');

      var domEls = [
        $('<p>Name: ' + elmnt.name + '</p>'),
        $('<p>Generation: ' + elmnt.generation + '</p>'),
        $('<p>DNA: </p>').append(elmnt.dna),
        $('<p>Fitness: ' + elmnt.fitness + '</p>'),
        $('<p>Parent1: ' + elmnt.parent1 + '</p>'),
        $('<p>Parent2: ' + elmnt.parent2 + '</p>')
      ];

      $(domEls).each(function(idx, elt){
        $(listItem).append(elt);
      });

      $('#gaDNAList').append(listItem);
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
