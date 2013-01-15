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
/*global webkitAudioContext:false */
'use strict';

var AFAudioContext = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['frequencies', 
      [27.5, 29.1352, 30.8677, 32.7032, 34.6478, 36.7081, 38.8909, 41.2034, 43.6535, 46.2493, 48.9994, 51.9131, 55, 58.2705, 61.7354, 65.4064, 69.2957, 73.4162, 77.7817, 82.4069, 87.3071, 92.4986, 97.9989, 103.826, 110, 116.541, 123.471, 130.813, 138.591, 146.832, 155.563, 164.814, 174.614, 184.997, 195.998, 207.652, 220.000, 233.082, 246.942, 261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305, 440, 466.164, 493.883, 523.251, 554.365, 587.330, 622.254, 659.255, 698.456, 739.989, 783.991, 830.609, 880, 932.328, 987.767, 1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760, 1864.66, 1975.53, 2093, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520, 3729.31, 3951.07, 4186.01
    ]]
  ])
);

AFAudioContext.init = function(frequency)
{
  this.audioContext = new webkitAudioContext();
  var source = this.audioContext.createOscillator();
  source.type = 0; // sine wave
  source.frequency.value = this.frequencies[_.random(15, 67)]; 
  source.connect(this.audioContext.destination);
  source.noteOn(0);
};

AFAudioContext.playSound = function(buffer, time){
  var source = this.audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(this.audioContext.destination);
  source.noteOn(time);
};

var AFDNACreature = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['name',       undefined],
    ['dna',        undefined],
    ['fitness',    undefined],
    ['notes',      undefined],
    ['generation', undefined],
    ['parent1',    undefined],
    ['parent2',    undefined]
  ])
);

var AFGeneticsLab = Object.create(AFObject, AFUtility.createPropertiesObject(
    [
      ['currentGenerationCount', 1],
      ['validNotes', ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#']],
      ['validOctave', [0, 1, 2, 3, 4, 5, 6, 7]]
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

    var tmpGradeArray = this.gradeDNA(dnaString);
    generation.push(Object.create(AFDNACreature, AFUtility.createPropertiesObject(
      [
        ['name',       (x + 1)],
        ['dna',        dnaString],
        ['fitness',    tmpGradeArray[0].toString()],
        ['notes',      tmpGradeArray[1]],
        ['generation', this.currentGenerationCount],
        ['parent1',    'first generation'],
        ['parent2',    'first generation']
      ])
    ));
  }
  return generation;
};

AFGeneticsLab.incrementNote = function(indexOfNote){
  return(this.validNotes[indexOfNote + 1]);
};

AFGeneticsLab.decrementNote = function(noteToDecrement, indexOfNote){
  return(this.validNotes[indexOfNote - 1]);
};

AFGeneticsLab.gradeDNA = function(dnaStrand)
{
  // right now gradeDNA is hardcoded around the notion of a 3 state dna bit.
  // This needs to be far more generic to handle a far wider range of use cases.
  var soundState    = true;
  var toneState     = 1;
  var dnaBits       = dnaStrand.split('');
  var fitnessScore  = 0;
  var currentNote   = this.validNotes[this.musicKey];
  var currentOctave = parseInt(this.octave, 10);
  var noteString    = '| ';
  var self          = this;
  var indexOfNote = _.indexOf(self.validNotes, currentNote);

  $(dnaBits).each(function(indx, elmnt){
    if(elmnt == 1)
    {
      toneState += 1;

      if(indexOfNote == 11 && indx === 0)
        currentOctave += 1;

      if(indexOfNote == 11)
        indexOfNote = -1;

      currentNote = self.incrementNote(indexOfNote);
    }
    else if(elmnt == 2)
    {
      toneState -= 1;
      if(indexOfNote === 0)
        indexOfNote = 12;

      currentNote = self.decrementNote(currentNote, indexOfNote);
    }
    indexOfNote = _.indexOf(self.validNotes, currentNote);

    if(toneState === 0)
    {
      toneState = 12;
      currentOctave -= 1;
    }
    else if(toneState == 13)
    {
      toneState = 1;
      currentOctave += 1;
    }

    if(currentOctave < 0)
      currentOctave = 0;

    if(currentOctave > 8)
      currentOctave = 8;

    if(elmnt === '0' && soundState === true)
      soundState = false;
    else if(elmnt === '0' && soundState === false)
      soundState = true;

    if(soundState === true)
      noteString += currentNote + currentOctave +  ' | ';
    else 
      noteString += '- | ';

    if(soundState === false)
      fitnessScore -= 5;

    if(_.contains(self.scaleSteps, toneState.toString()) && soundState === true)
      fitnessScore += 10;
    else
      fitnessScore -= 10;
  });

  return [fitnessScore, noteString];
};

AFGeneticsLab.getClosestValues = function(a, x)
{
  var lo = 0, hi = a.length-1;
  while (hi - lo > 1) {
    var mid = Math.round((lo + hi)/2);
    if (a[mid] <= x)
      lo = mid;
    else
      hi = mid;
  }
  if (a[lo] == x) 
    hi = lo;
  return [_.indexOf(a, a[hi]), a[hi]];
};

AFGeneticsLab.evolveDNA = function(generation)
{
  var self = this;

  for(var itr = 0; itr < this.generationCount - 1; itr++)
  {
    var matedDNA = [];
    this.currentGenerationCount++;

    for(var itertr = 0; itertr < (this.generationSize / 2); itertr++)
    {
      var sortedGeneration = generation.sort(function(a,b){return a.fitness - b.fitness;});
      var probabilityRange = _.range(1, this.generationSize + 1);

      var total = 0;
      _.map(probabilityRange, function(elmnt){
        total += elmnt;
      });
      var mappedArray = _.map(probabilityRange, function(num){
        var tmp = num / total;
        return parseFloat(tmp.toFixed(10));
      });

      var cumulativeTotal = 0;
      var cumulativeArray = _.map(mappedArray, function(num){
        return cumulativeTotal += num;
      });
      var closestValues1 = this.getClosestValues(cumulativeArray, Math.random());
      var closestValues2 = this.getClosestValues(cumulativeArray, Math.random());

      matedDNA.push(this.mateDNA(sortedGeneration[closestValues1[0]], sortedGeneration[closestValues2[0]], itertr));
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
  var dnaBreakPoint  = _.random((this.dnaBitCount - 2), 2);
  
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

  var mutateDNA;
  if(this.mutationPercentage > 0)
    mutateDNA = _.random(0, (100 / this.mutationPercentage) - 1);

  if(mutateDNA === 0)
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

  if(parents['parent1SliceA'][2] !== undefined)
    parent1SliceA = $(parents['parent1SliceA']).text();

  if(parents['parent1SliceB'][2] !== undefined)
    parent1SliceB = $(parents['parent1SliceB']).text();

  if(parents['parent2SliceA'][2] !== undefined)
    parent2SliceA = $(parents['parent2SliceA']).text();

  if(parents['parent2SliceB'][2] !== undefined)
    parent2SliceB = $(parents['parent2SliceB']).text();

  var concatDNAStrands = [[parent1SliceA + parent2SliceB, $(tmpSpanEl1A).after(tmpSpanEl2B[0])], [parent2SliceA + parent1SliceB, $(tmpSpanEl2A).after(tmpSpanEl1B[0])]];

  var createNewCreaturesArray = [];

  var self = this;
  var name;
  $(concatDNAStrands).each(function(indx, elment){
    if(indx === 0)
      name = ((itertr + 1) * 2) - 1;
    else
      name = ((itertr + 1) * 2);

    var tmpGrade = self.gradeDNA(elment[0]);
    createNewCreaturesArray.push(Object.create(AFDNACreature, AFUtility.createPropertiesObject(
      [
        ['name',       name],
        ['dna',        elment[1]],
        ['fitness',    tmpGrade[0].toString()],
        ['notes',      tmpGrade[1]],
        ['generation', self.currentGenerationCount],
        ['parent1',    parent1],
        ['parent2',    parent2]
      ])
    ));
  });

  return createNewCreaturesArray;
};

AFGeneticsLab.mutateDNA = function(dnaStrand)
{
  var mutatedGene = _.random(0, (this.dnaStepCount - 1));
  if(dnaStrand.length > 1)
  {
    var counter = _.random(1, (dnaStrand.length - 1));
    var parentSliceA = dnaStrand.slice(0, counter);
    var parentSliceB = dnaStrand.slice(counter);
    var childSliceA = parentSliceA.slice(0, parentSliceA.length - 1);
    var spanElmnt1 = $('<span></span>');
    var spanElmnt2 = $('<span class="mutatedDNA">' + mutatedGene + '</span>');
    $(spanElmnt1).append(childSliceA);
    return $(spanElmnt1).after(spanElmnt2).after(parentSliceB);
  }
  else
    return $('<span class="mutatedDNA">' + mutatedGene + '</span>');
};
