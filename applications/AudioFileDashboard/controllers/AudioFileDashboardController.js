var AudioFileDashboardController = (function(){
  function AudioFileDashboardController()
  {
    console.log('created!');
  }

  AudioFileDashboardController.prototype = new AudioFileDashboardController();

  AudioFileDashboardController.prototype.onAFApplicationStart = function()
  {
    console.log('cted!');
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
