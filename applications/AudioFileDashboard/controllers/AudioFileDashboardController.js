//self.addEventListener('message', function(e) {
//  self.postMessage(e.data);
//}, false);

var AudioFileDashboardController = Object.create(AFController);

AudioFileDashboardController.onAFApplicationStart = function()
{
  console.log('AudioFile Dashboard App!');
  //// create view and column layout 
  //var afDashBoardApplicationView = Object.create(AFApplicationView);
  //afDashBoardApplicationView.setLayout(Object.create(AFColumnLayout));
  //afDashBoardApplicationView.afLayoutcolumnCount = 2;
  //
  //// create left column
  //var leftColumn = Object.create(AFColumnLayoutItem);
  //leftColumn.columnItemWidthPercentage = 50;

  //// create hello world header
  //var header = Object.create(AFHeader);
  //header.textValue = 'Hello World';

  //// create right column
  //var rightColumn = Object.create(AFColumnLayoutItem);
  //rightColumn.columnItemWidthPercentage = 50;

  //var columns = [leftColumn, rightColumn];
  //afDashBoardApplicationView.afLayout.setColumns(columns);

};

AudioFileDashboardController.onAFApplicationStop = function(){};

AudioFileDashboardController.onAFApplicationPause = function(){};

AudioFileDashboardController.onAFApplicationUnpause = function(){};
