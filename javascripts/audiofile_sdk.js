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
// All Objects in the AudioFile Framework have AFObject as their final prototype before the JS Object
var AFObject = {};
AFObject.init = function(){};

var AFController = Object.create(AFObject);
// All Application controllers have AFController as their prototype and should implement a method for all 4 stages of the Application Lifecycle
AFController.onAFApplicationStart = function(){};

AFController.onAFApplicationStop = function(){};

AFController.onAFApplicationPause = function(){};

AFController.onAFApplicationUnpause = function(){};

var AFUtility = Object.create(AFObject);

AFUtility.createPropertiesObject = function(propertiesDataArray)
{
  var returnObject= {};

  propertiesDataArray.forEach(function(element, index)
  {
    returnObject[element[0]] = {
      value        : element[1] ? element[1] : undefined,
      writable     : element[2] ? element[2] : true,
      enumerable   : element[3] ? element[3] : true,
      congifurable : element[4] ? element[4] : true
    };
  });

  return returnObject;
};

// AFCoreController runs the Lifecycle of the AudioFile Framework/SDK
var AFCoreController = Object.create(AFController); 

AFCoreController.onAFApplicationStart = function()
{
  var afApplicationManager = Object.create(AFApplicationManager);
  afApplicationManager.startAFApplication({
    "controller" : "AudioFileGeneticsLab"
  });
};

// AFApplicationManager Manages the Applications. Creates new AFApplications
var AFApplicationManager = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['activeApplication', null],
    ['hasActiveApplication', false]
  ])
); 

AFApplicationManager.startAFApplication = function(startAppJson)
{
  if(!this.hasActiveApplication)
  {
    this.activeApplication = Object.create(AFApplication);
    this.hasActiveApplication = true;
    this.activeApplication.init(startAppJson.controller);
  }
};

AFApplicationManager.stopAFApplication = function(){};

AFApplicationManager.pauseAFApplication = function(){};

AFApplicationManager.unpauseAFApplication = function(){};

var AFApplication = Object.create(AFObject);

AFApplication.init = function(applicationControllerName)
{
  this.applicationControllerName = applicationControllerName;
  this.getApplicationManifest();
};

AFApplication.getApplicationManifest = function()
{
  var self = this;
  // $.getJSON grabs the manifest which has the app's controller's name
  $.getJSON('applications/' + this.applicationControllerName + '/config/AFManifest.json', function(data)
  {
    self.applicationManifest = data;
    self.getApplicationController();
  });
};

AFApplication.getApplicationController = function()
{
  var self = this;
  $.getScript('applications/' + this.applicationControllerName + '/controllers/' + this.applicationControllerName + 'Controller.js', function(data, textStatus, jqxhr)
  {
    self.applicationController = Object.create(window[self.applicationControllerName + 'Controller']);
    self.getApplicationDOM();
  });
};

AFApplication.getApplicationDOM = function()
{
  var self = this;
  $.get('applications/' + this.applicationControllerName + '/views/index.html', function(data)
  {
    self.applicationDOM = data;
    self.startApplication();
    //self.createWebWorker();
  });
};

AFApplication.startApplication = function()
{
  AFLayoutEngine.injectDOMIntoIframe(this.applicationDOM, this.applicationControllerName);

  this.applicationController.onAFApplicationStart();
};

AFApplication.stopApplication = function(){};

AFApplication.pauseApplication = function(){};

AFApplication.unpauseApplication = function(){};

AFApplication.createWebWorker = function()
{
  var afWebWorker = Object.create(AFWebWorker);
  afWebWorker.init(this.applicationControllerName);
  afWebWorker.postMessage('Test');

  afWebWorker.webWorker.onmessage = function(event)
  {
    afWebWorker.onMessage(event.data);
  };
};

var AFLayoutEngine = Object.create(AFObject);
AFLayoutEngine.injectDOMIntoIframe = function(applicationDOM, applicationControllerName)
{
  var iframeWrapperDiv = document.createElement('div');
  iframeWrapperDiv.id = 'iframeWrapperDiv';
  iframeWrapperDiv.style.height = '100%';
  iframeWrapperDiv.style.overflow = 'scroll';
  var newIframe = document.createElement('iframe');
  iframeWrapperDiv.appendChild(newIframe);
  newIframe.src = 'about:blank'; 
  newIframe.id  = applicationControllerName; 
  document.body.appendChild(iframeWrapperDiv);

  newIframe.contentWindow.document.open('text/html', 'replace');
  newIframe.contentWindow.document.write(applicationDOM);
  newIframe.contentWindow.document.close();
};

var AFWebWorker = Object.create(AFObject);
AFWebWorker.init = function(applicationControllerName)
{
  //var blob = AFBlob(["self.onmessage=function(e){postMessage('Worker: '+e.data);}"]);
  //var afURL = new AFURL();
  //this.webWorker = new Worker(afURL.createObjectURL(blob.afBlob));
  
  this.webWorker = new Worker('applications/' + applicationControllerName + '/controllers/' + applicationControllerName + 'Controller.js');
};

AFWebWorker.postMessage = function(message)
{
  this.webWorker.postMessage(message);
};

AFWebWorker.onMessage = function(message)
{
  console.log('Response: ' + message);
};

var AFBlob = Object.create(AFObject); 
AFBlob.init = function(scriptArray)
{
  this.afBlob = new Blob(scriptArray);
};

var AFView = Object.create(AFObject,AFUtility.createPropertiesObject(
  [
    ['afLayout', null]
  ])
);

AFView.setLayout = function(afLayoutObj)
{
  this.afLayout = Object.create(afLayoutObj);
};

var AFApplicationView = Object.create(AFView);

var AFLayout = Object.create(AFObject,AFUtility.createPropertiesObject(
  [
    ['afApplicationView', null],
    ['displayStyle', 'block']
  ])
);

AFLayout.setView = function(afViewObj)
{
  this.afView = Object.create(afViewObj);
};

AFLayout.setChild = function(AFLayoutItemObj)
{
 // build DOM here
};

var AFListLayout = Object.create(AFLayout, AFUtility.createPropertiesObject(
  [
    ['listItemCount', 1]
  ])
);

var AFUnorderedListLayout = Object.create(AFListLayout);

var AFOrderedListLayout = Object.create(AFListLayout);

var AFColumnLayout = Object.create(AFLayout, AFUtility.createPropertiesObject(
  [
    ['columnCount', 1]
  ])
);
AFColumnLayout.setColumns = function(columnsObj)
{
};

var AFGridLayout = Object.create(AFLayout, AFUtility.createPropertiesObject(
  [
    ['rowCount', 1]
  ])
);

var AFLayoutItem = Object.create(AFLayout);

var AFListLayoutItem = Object.create(AFLayoutItem);

var AFColumnLayoutItem = Object.create(AFLayoutItem, AFUtility.createPropertiesObject(
  [
    ['columnItemWidthPercentage', 100],
    ['displayStyle', 'inline']
  ])
);

var AFGridLayoutItem = Object.create(AFLayoutItem, AFUtility.createPropertiesObject(
  [
    ['columnCount', 1]
  ])
);

var AFForm = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['action', null],
    ['method', 'post']
  ])
);

var AFInputField = Object.create(AFObject);

var AFTextInputField = Object.create(AFInputField, AFUtility.createPropertiesObject(
  [
    ['autofocus', false],
    ['placeholder', null],
    ['type', 'text'],
    ['value', null]
  ])
);

var AFPasswordInputField = Object.create(AFTextInputField, AFUtility.createPropertiesObject(
  [
    ['type', 'password']
  ])
);

var AFEmailInputField= Object.create(AFTextInputField, AFUtility.createPropertiesObject(
  [
    ['type', 'email']
  ])
);

var AFText = Object.create(AFObject, AFUtility.createPropertiesObject(
  [
    ['textValue', null],
    ['fontWeight', 200],
    ['fontColor', '#000'],
    ['fontFamily', 'helvetica']
  ]
));

var AFHeader = Object.create(AFText, AFUtility.createPropertiesObject(
  [
    ['type', 1]
  ])
);

var AFURL = Object.create(AFObject); 
AFURL.createObjectURL = function(afBlob)
{
  return URL.createObjectURL(afBlob);
};

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

  var dnaBreakPoint = Math.floor((Math.random() * (this.dnaBitCount - 1)) + 1);
  //var dnaBreakPoint = 1;
  
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
  if(true)
  {
    var parentToMutate = _.random(0, 3);
    parents[parentKeys[parentToMutate]] = this.mutateDNA(parents[parentKeys[parentToMutate]][1]);
  }
    console.log(parents);

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
        ['fitness',  self.gradeDNA(elment[0])],
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
    var spanElmnt2 = $('<span class="mutatedDNA">' + mutatedGene + '</span>');
    $(spanElmnt1).append(childSliceA);
    return spanElmnt2;
  }
};

// This is the first and only Object created from the audiofile_sdk index.html file
var AFCore = Object.create(AFObject);
AFCore.init = function()
{
  var afCoreController = Object.create(AFCoreController);
  afCoreController.onAFApplicationStart();
};

//return AFTextInputField.prototype.constructor.call(autofocus, placeholder);
//console.log(AFApplicationManager.isPrototypeOf(afApplicationManager));

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
