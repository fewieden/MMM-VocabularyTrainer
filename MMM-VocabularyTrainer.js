/**
 * @file MMM-VocabularyTrainer.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-VocabularyTrainer
 */

/* global Module Log */

/**
 * @external Module
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/module.js
 */

/**
 * @external Log
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/logger.js
 */

/**
 * @module MMM-VocabularyTrainer
 * @description Frontend for the module to display data.
 *
 * @requires external:Module
 * @requires external:Log
 */
Module.register('MMM-VocabularyTrainer', {

    /** @member {boolean} loaded - Flag to indicate if word sets have been loaded. */
    loaded: false,
    /** @member {?Timeout} wordSwitcher - Toggles between native and foreign word. */
    wordSwitcher: null,
    /** @member {?Interval} countdown - Updates countdown bar */
    countdown: null,

    /**
     * @member {Object} defaults - Defines the default config values.
     * @property {int} nativeTimeout - Time native word is displayed.
     * @property {int} foreignTimeout - Time foreign word is displayed.
     * @property {boolean} showTimeLeft - Show how much time is left until change.
     * @property {boolean} revert - Reverts native to foreign.
     * @property {boolean} color - Use color for countdown bar.
     * @property {string} width - Module width.
     * @property {string} provider - API provider to use.
     */
    defaults: {
        nativeTimeout: 10 * 1000,
        foreignTimeout: 20 * 1000,
        showTimeLeft: true,
        revert: false,
        color: false,
        width: '100%',
        provider: 'custom'
    },

    /**
     * @function getTranslations
     * @description Translations for this module.
     * @override
     *
     * @returns {Object.<string, string>} Available translations for this module (key: language code, value: filepath).
     */
    getTranslations() {
        return {
            de: 'translations/de.json',
            en: 'translations/en.json'
        };
    },

    /**
     * @function getStyles
     * @description Style dependencies for this module.
     * @override
     *
     * @returns {string[]} List of the style dependency filepaths.
     */
    getStyles() {
        return ['MMM-VocabularyTrainer.css'];
    },

    /**
     * @function start
     * @description Sends the config to the node_helper.
     * @override
     */
    start() {
        Log.info(`Starting module: ${this.name}`);
        this.sendSocketNotification('CONFIG', this.config);
    },

    /**
     * @function socketNotificationReceived
     * @description Handles incoming messages from node_helper.
     * @override
     *
     * @param {string} notification - Notification name
     * @param {*} payload - Detailed payload of the notification.
     */
    socketNotificationReceived(notification, payload) {
        if (notification === 'WORDSET') {
            this.wordSet = payload;
            this.setCurrentWord();
            clearTimeout(this.wordSwitcher);
            this.wordSwitcher = setTimeout(() => {
                this.setCurrentWord(true);
            }, this.config.nativeTimeout);
        }
    },

    /**
     * @function setCurrentWord
     * @description Toggles between native and foreign word.
     * @param {boolean} translation - Flag to switch to foreign word.
     */
    setCurrentWord(translation) {
        clearInterval(this.countdown);
        if ((translation && !this.config.revert) || (!translation && this.config.revert)) {
            this.word = 'foreign';
        } else {
            this.word = 'native';
        }
        this.loaded = true;
        this.updateDom(300);
    },

    /**
     * @function getDom
     * @description Creates the UI as DOM for displaying in MagicMirror application.
     * @override
     *
     * @returns {Element}
     */
    getDom() {
        const wrapper = document.createElement('div');

        if (!this.loaded) {
            wrapper.innerHTML = this.translate('LOADING');
            wrapper.classList.add('dimmed', 'light');
        } else {
            const word = document.createElement('div');
            word.classList.add('center');
            word.innerHTML = this.wordSet[this.word];
            wrapper.appendChild(word);

            if (this.config.showTimeLeft) {
                const countdown = document.createElement('div');
                countdown.classList.add('bar', 'nostripes');
                countdown.style.width = this.config.width;

                const span = document.createElement('span');
                if (this.config.color) {
                    span.classList.add('relax');
                }
                let countdownWidth = 100;
                const countdownStep = Math.floor(100 / (this.config[`${this.word}Timeout`] / 1000));
                span.style.width = `${countdownWidth}%`;

                Log.info(countdownStep);
                this.countdown = setInterval(() => {
                    Log.info(countdownWidth);
                    countdownWidth -= countdownStep;
                    if (this.config.color) {
                        if (countdownWidth > 66) {
                            span.className = 'relax';
                        } else if (countdownWidth > 33) {
                            span.className = 'concentrate';
                        } else {
                            span.className = 'hurryup';
                        }
                    } else {
                        span.style.opacity = countdownWidth / 100;
                    }
                    span.style.width = `${countdownWidth}%`;
                }, 1000);

                countdown.appendChild(span);
                wrapper.appendChild(countdown);
            }
        }

        return wrapper;
    }
});
