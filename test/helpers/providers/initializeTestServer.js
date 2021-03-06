const Ganache = require(process.env.TEST_BUILD
  ? "../../build/ganache.core." + process.env.TEST_BUILD + ".js"
  : "../../../index.js");
const Web3 = require("web3");
const Web3WsProvider = require("web3-providers-ws");

/**
 * Initialize Ganache provider with `options`
 * @param {Object} options - Ganache provider options
 * @returns {Object} accounts, provider, web3 Object
 */
const initializeTestServer = (tests, options = {}, port = 12345) => {
  return function(done) {
    const web3 = new Web3();
    let server;

    before("Initialize Ganache server", function(done) {
      server = Ganache.server(options);
      server.listen(port, async function() {
        if (options.ws) {
          web3.setProvider(new Web3WsProvider(`ws://localhost:${port}`));
        } else {
          web3.setProvider(new Web3.providers.HttpProvider(`http://localhost:${port}`));
        }
        done();
      });
    });

    after("Shutdown server", function(done) {
      server.close(done);
    });

    tests(web3);
  };
};

module.exports = initializeTestServer;
