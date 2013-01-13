window.onload = function()
{
  'use strict';
  var afGeneticsLab = Object.create(AFGeneticsLab);

  $('#gaSubmit').click(function(evnt) {
    afGeneticsLab.setProperties({
      generationSize  : parseInt($('#generationSize').val(), 10),
      generationCount : parseInt($('#generationCount').val(), 10),
      dnaBitCount     : parseInt($('#dnaBitCount').val(), 10),
      dnaStepCount    : parseInt($('#dnaStepCount').val(), 10),
      scaleSteps      : $('#scaleSteps').val().split(',')
    });

    // create a generation of creatures and evolve/sort them
    var generationOfCreatures = afGeneticsLab.generateCreatures();

    // Evolve them and sort by fitness score
    var sortedEvolvedGenerationOfCreatures = afGeneticsLab.evolveDNA(generationOfCreatures).sort(function(a,b){return a.fitness - b.fitness;}).reverse();

    $(sortedEvolvedGenerationOfCreatures).each(function(indx, elmnt){
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
};
