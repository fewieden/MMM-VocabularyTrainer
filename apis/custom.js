/**
 * @file apis/custom.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-VocabularyTrainer
 */

/**
 * @external fs
 * @see https://nodejs.org/api/fs.html
 */
const fs = require('fs');

/**
 * @module apis/custom
 * @description Queries data from MMM-VocabularyTrainer.json
 *
 * @requires external:fs
 */
module.exports = () => {
    /** @member {string} filePath - Path to custom Vocabulary file */
    const filePath = 'modules/MMM-VocabularyTrainer/public/MMM-VocabularyTrainer.json';

    return {
        /**
         * @callback getDataCallback
         * @param {?string} error - Error message.
         * @param {Object} data - API vocabulary data.
         *
         * @see apis/README.md
         */

        /**
         * @function getData
         * @description Performs the data query and processing.
         *
         * @param {getDataCallback} callback - Callback that handles the API data.
         */
        getData(callback) {
            fs.stat(filePath, (error, stats) => {
                if (!error && stats.isFile()) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (!err) {
                            const wordSets = JSON.parse(data);
                            callback(null, wordSets);
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback("MMM-VocabularyTrainer Custom: Couldn't find file!");
                }
            });
        }
    };
};
