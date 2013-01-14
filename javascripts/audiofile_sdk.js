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
/*global AFObject:false */
/*global AFUtility:false */
'use strict';

var AFDNACreature = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['name', undefined],
    ['dna', undefined],
    ['fitness', undefined],
    ['generation', undefined],
    ['parent1', undefined],
    ['parent2', undefined]
  ])
);

var AFGeneticsLab = Object.create(AFObject, AFUtility.createPropertiesObject(
    [
      ['currentGenerationCount', 1]
    ])
); 

AFGeneticsLab.setProperties = function(properties)
{
  _.each(properties, function(value, key){
    this[key] = value;
  }, this);
};

AFGeneticsLab.generateCreatures = function()
{
  var generation = [];
  for(var x = 0; x < this.generationSize; x++)
  {
    var dnaString = '';
    for(var i = 0; i < this.dnaBitCount; i++)
      dnaString += _.random(0, (this.dnaStepCount - 1));

    generation.push(Object.create(AFDNACreature, AFUtility.createPropertiesObject(
      [
        ['name', (x + 1)],
        ['dna', dnaString],
        ['fitness', this.gradeDNA(dnaString).toString()],
        ['generation', this.currentGenerationCount],
        ['parent1', 'first generation'],
        ['parent2', 'first generation']
      ])
    ));
  }
  return generation;
};

AFGeneticsLab.gradeDNA = function(dnaStrand)
{
  // right now gradeDNA is hardcoded around the notion of a 3 state dna bit.
  // This needs to be far more generic to handle a far wider range of use cases.
  var soundState = true;
  var toneState = 1;
  var dnaBits = dnaStrand.split('');
  var fitnessScore = 0;

  var self = this;
  $(dnaBits).each(function(indx, elmnt){
    if(elmnt === 0 && soundState === true)
      soundState = false;
    else if(elmnt === 0 && soundState === false)
      soundState = true;

    if(elmnt == 1)
      toneState += 1;

    if(elmnt == 2)
      toneState -= 1;

    if(toneState === 0)
      toneState = 12;
    else if(toneState == 13)
      toneState = 1;

    if(soundState === false)
      fitnessScore -= 5;

    if(_.contains(self.scaleSteps, toneState.toString()))
      fitnessScore += 10;
    else
      fitnessScore -= 10;
  });

  return fitnessScore;
};

AFGeneticsLab.evolveDNA = function(generation)
{
  for(var itr = 0; itr < this.generationCount - 1; itr++)
  {
    var matedDNA = [];
    this.currentGenerationCount++;

    for(var itertr = 0; itertr < (this.generationSize / 2); itertr++)
    {
      var parent1 = generation[Math.floor((Math.random() * this.generationSize) + 0)];
      var parent2 = generation[Math.floor((Math.random() * this.generationSize) + 0)];
      matedDNA.push(this.mateDNA(parent1, parent2, itertr));
    }

    var generation = [];
    $(matedDNA).each(function(inxx, ell){
      $(ell).each(function(innx, elmm){
        generation.push(elmm);
      });
    });
  }
  return generation;
};

AFGeneticsLab.mateDNA = function(parent1, parent2, itertr)
{
  // here is where the two parent are chosen.
  // how can we weight the selection ever greater in favor of higher fitness
  // rated creatures?
  // length of generation array - current creatures index in current
  // generation array gives assigned probability

  //var dnaBreakPoint = Math.floor((Math.random() * (this.dnaBitCount - 1)) + 1);
  var dnaBreakPoint = 1;
  
  var parent1SliceA, parent1SliceB, parent2SliceA, parent2SliceB;
  if(parent1.dna[1] !== undefined)
  {
    var tmpParent1 = parent1.dna[0].innerText + parent1.dna[1].innerText;
    parent1SliceA = tmpParent1.slice(0, dnaBreakPoint);
    parent1SliceB = tmpParent1.slice(dnaBreakPoint);
  
    var tmpParent2 = parent2.dna[0].innerText + parent2.dna[1].innerText;
    parent2SliceA = tmpParent2.slice(0, dnaBreakPoint);
    parent2SliceB = tmpParent2.slice(dnaBreakPoint);
  }
  else
  {
    parent1SliceA = parent1.dna[0].innerText.slice(0, dnaBreakPoint);
    parent1SliceB = parent1.dna[0].innerText.slice(dnaBreakPoint);
  
    parent2SliceA = parent2.dna[0].innerText.slice(0, dnaBreakPoint);
    parent2SliceB = parent2.dna[0].innerText.slice(dnaBreakPoint);
  }

  var parents = {
    parent1SliceA : [
      'parent1DNA',
      parent1SliceA
    ], 
    parent1SliceB : [
      'parent1DNA',
      parent1SliceB
    ], 
    parent2SliceA : [
      'parent2DNA',
      parent2SliceA
    ], 
    parent2SliceB : [
      'parent2DNA',
      parent2SliceB
    ]
  };

  var parentKeys = Object.keys(parents);

  var mutateDNA = _.random(0, 19);
  //if(mutateDNA < 10)
  if(false)
  {
    var parentToMutate = _.random(0, 3);
    parents[parentKeys[parentToMutate]] = this.mutateDNA(parents[parentKeys[parentToMutate]][1]);
  }

  var tmpSpanEl1A, tmpSpanEl1B, tmpSpanEl2A, tmpSpanEl2B;
  if(parents.parent1SliceA[2] !== undefined)
    tmpSpanEl1A = $('<span class="parent1DNA">').append(parents.parent1SliceA);
  else
    tmpSpanEl1A = $('<span class="parent1DNA">' + parents.parent1SliceA[1] + '</span>');

  if(parents.parent1SliceB[2] !== undefined)
    tmpSpanEl1B = $('<span class="parent1DNA">').append(parents.parent1SliceB);
  else
    tmpSpanEl1B = $('<span class="parent1DNA">' + parents.parent1SliceB[1] + '</span>');

  if(parents.parent2SliceA[2] !== undefined)
    tmpSpanEl2A = $('<span class="parent2DNA">').append(parents.parent2SliceA);
  else
    tmpSpanEl2A = $('<span class="parent2DNA">' + parents.parent2SliceA[1] + '</span>');

  if(parents.parent2SliceB[2] !== undefined)
    tmpSpanEl2B = $('<span class="parent2DNA">').append(parents.parent2SliceB);
  else
    tmpSpanEl2B = $('<span class="parent2DNA">' + parents.parent2SliceB[1] + '</span>');

  var concatDNAStrands = [[parent1SliceA + parent2SliceB, $(tmpSpanEl1A).after(tmpSpanEl2B[0])], [parent2SliceA + parent1SliceB, $(tmpSpanEl2A).after(tmpSpanEl1B[0])]];

  var createNewCreaturesArray = [];

  var self = this;
  var name;
  $(concatDNAStrands).each(function(indx, elment){
    if(indx === 0)
      name = ((itertr + 1) * 2) - 1;
    else
      name = ((itertr + 1) * 2);

    createNewCreaturesArray.push(Object.create(AFDNACreature, AFUtility.createPropertiesObject(
      [
        ['name', name],
        ['dna', elment[1]],
        ['fitness',  self.gradeDNA(elment[0]) ? self.gradeDNA(elment[0]) : '0'],
        ['generation', self.currentGenerationCount],
        ['parent1', parent1],
        ['parent2', parent2]
      ])
    ));
  });

  return createNewCreaturesArray;
};

AFGeneticsLab.mutateDNA = function(dnaStrand)
{
  if(dnaStrand.length > 1)
  {
    var counter = _.random(1, (dnaStrand.length - 1));
    var parentSliceA = dnaStrand.slice(0, counter);
    var parentSliceB = dnaStrand.slice(counter);
    var childSliceA = parentSliceA.slice(0, parentSliceA.length - 1);
    var mutatedGene = _.random(0, (this.dnaStepCount - 1));
    var spanElmnt1 = $('<span></span>');
    var spanElmnt2 = $('<span class="mutatedDNA">' + mutatedGene + '</span>');
    $(spanElmnt1).append(childSliceA);
    return $(spanElmnt1).after(spanElmnt2).after(parentSliceB);
  }
  else
  {
    var mutatedGene = _.random(0, (this.dnaStepCount - 1));
    var spanElmnt2 = $('<span class="mutatedDNA">1</span>');
    return spanElmnt2;
  }
};
