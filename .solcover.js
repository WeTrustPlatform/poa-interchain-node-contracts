module.exports = {
  norpc: true,
  port: 8555,
  testrpcOptions: '--port 8555 -m \"candy maple cake sugar pudding cream honey rich smooth crumble sweet treat\"',
  skipFiles: [
    'test/ExampleToken.sol',
    'test/TestFreezable.sol',
    'test/TestMultiSigOwnable.sol'
  ]
};