/**
 * Returns service based on vehicle type
 *
 * @param type ['GM']
 * @returns {GMService}
 */
module.exports = function (type) {
      if (type === 'GM') {
          var GMService = require('./gm-service');
          return new GMService();
      }
}