var AudioFileDashboardController = (function(){
  function AudioFileDashboardController()
  {
  }

  AudioFileDashboardController.prototype = new AudioFileDashboardController();

  AudioFileDashboardController.prototype.onAFApplicationStart = function()
  {
    console.log('AudioFileDashboardController onAFApplicationStart called');
  };

  AudioFileDashboardController.prototype.onAFApplicationStop = function()
  {
  };

  AudioFileDashboardController.prototype.onAFApplicationPause = function()
  {
  };

  AudioFileDashboardController.prototype.onAFApplicationUnpause = function()
  {
  };
  return AudioFileDashboardController;
})();
