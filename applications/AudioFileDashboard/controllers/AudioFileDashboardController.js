var AudioFileDashboardController = Object.create(AFController);

AudioFileDashboardController.onAFApplicationStart = function()
{
  var afDashBoardApplicationView = Object.create(AFApplicationView);
  var afColumnLayout1 = Object.create(AFColumnLayout);
  afDashBoardApplicationView.setLayout(afColumnLayout1);
  console.log(afDashBoardApplicationView);
  console.log(afColumnLayout1);
};

AudioFileDashboardController.onAFApplicationStop = function()
{};

AudioFileDashboardController.onAFApplicationPause = function()
{};

AudioFileDashboardController.onAFApplicationUnpause = function()
{};
