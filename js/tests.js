test("Parser output", function() {
  var audiofile_sdk = new AFSDK();
  var parserOutput = audiofileSDK.parse('doc1');
  ok(true, parserOutput);
});
