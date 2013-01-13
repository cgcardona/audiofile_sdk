/*jshint globalstrict:true*/
/*global $:false */
/*global _:false */
/*global AFGeneticsLab:false */
'use strict';
window.onload = function()
{
  var afGeneticsLab = Object.create(AFGeneticsLab);

  $('#gaSubmit').click(function(evnt) {
    afGeneticsLab.setProperties({
      generationSize  : parseInt($('#generationSize').val(), 10),
      generationCount : parseInt($('#generationCount').val(), 10),
      dnaBitCount     : parseInt($('#dnaBitCount').val(), 10),
      dnaStepCount    : parseInt($('#dnaStepCount').val(), 10),
      scaleSteps      : $('#scaleSteps').val().split(',')
    });

    // create a generation of creatures
    var generationOfCreatures = afGeneticsLab.generateCreatures();

    // Because it's the first generation wrap their dna property in a span with a class
    _.each(generationOfCreatures, function(value, key){
      var rootSpan = $('<span class="root">' + value.dna + '</span>');
      value.dna = rootSpan;
    }, this);

    // Evolve them and sort by fitness score
    var evolvedGenerationOfCreatures = afGeneticsLab.evolveDNA(generationOfCreatures);
    var sortedGenerationOfCreatures = evolvedGenerationOfCreatures.sort(function(a,b){return a.fitness - b.fitness;}).reverse();

    $(sortedGenerationOfCreatures).each(function(indx, elmnt){
      var listItem = $('<li>');

      //console.log(elmnt.dna);
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
