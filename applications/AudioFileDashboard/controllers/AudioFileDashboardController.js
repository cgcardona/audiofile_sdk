var AudioFileDashboardController = Object.create(AFController);

AudioFileDashboardController.onAFApplicationStart = function()
{
  // create view and column layout 
  var afDashBoardApplicationView = Object.create(AFApplicationView);
  afDashBoardApplicationView.setLayout(Object.create(AFColumnLayout));
  afDashBoardApplicationView.afLayout.setPropVal('columnCount', 2);
  
  // create left column
  var leftColumn = Object.create(AFColumnLayoutItem);
  leftColumn.setPropVal('columnItemWidthPercentage', 50);

  // create right column
  var rightColumn = Object.create(AFColumnLayoutItem);
  rightColumn.setPropVal('columnItemWidthPercentage', 50);

  var columns = [leftColumn, rightColumn];
  afDashBoardApplicationView.afLayout.setColumns(columns);

};

AudioFileDashboardController.onAFApplicationStop = function(){};

AudioFileDashboardController.onAFApplicationPause = function(){};

AudioFileDashboardController.onAFApplicationUnpause = function(){};
