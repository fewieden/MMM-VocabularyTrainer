/**
 * @file apis/geschichtsvereinkoengen.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-VocabularyTrainer
 */

/**
 * @external jsdom
 * @see https://www.npmjs.com/package/jsdom
 */
const JSDOM = require('jsdom').JSDOM;

/**
 * @module apis/geschichtsvereinkoengen
 * @description Queries data from {@link http://geschichtsverein-koengen.de/}.
 *
 * @requires external:jsdom
 */
module.exports = () => {
    /** @member {string} baseUrl - Base url of the provider */
    const baseUrl = 'http://geschichtsverein-koengen.de/';

    /** @member {string} name - Displaying name for log messages. */
    const name = 'MMM-VocabularyTrainer geschichtsvereinkoengen';

    /**
     * @function formatText
     * @description Helper function to get plain text.
     *
     * @param {Object} item - Table column
     */
    const formatText = item => item.textContent
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/ {2,}/g, '')
        .trim();

    /**
     * @function filterVocabularies
     * @description Helper function to filter vocabularies which don't have a key and value.
     *
     * @param {Object} item - Table row
     */
    const filterVocabularies = (item) => {
        const native = item.children[0].textContent.trim();
        const foreign = item.children[1].textContent.trim();

        return native && foreign;
    };

    /**
     * @function normalizeVocabularies
     * @description Helper function to normalize the structure of vocabularies for the UI.
     *
     * @param {Object} item - Table row
     *
     * @see apis/README.md
     */
    const normalizeVocabularies = (item) => {
        const native = formatText(item.children[0]);
        const foreign = formatText(item.children[1]);

        return { native, foreign };
    };

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
            JSDOM.fromURL(`${baseUrl}RoemSprichwort.htm`)
            .then((dom) => {
                const document = dom.window.document;
                try {
                    const nodeList = document.querySelectorAll('table[dir="ltr"] > tbody > tr > td:last-child > table:nth-child(2) > tbody > tr');
                    const filteredVocabularies = Array.prototype.slice.call(nodeList).filter(filterVocabularies);
                    const normalizedVocabularies = filteredVocabularies.map(normalizeVocabularies);
                    callback(null, normalizedVocabularies);
                } catch (e) {
                    callback(`${name}: ${e.message}`);
                }
            }, (err) => {
                callback(`${name}: ${err}`);
            });
        }
    };
};
