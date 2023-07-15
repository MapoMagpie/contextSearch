/* eslint-disable no-case-declarations */
'use strict';

/// Global variables
/* global  */
let searchEngines = {};
let selection = '';
let targetUrl = '';
let lastAddressBarKeyword = '';
let historyItems, bookmarkItems;
let CORS_API_URL;
let CORS_API_KEY;

/// Constants
// Debug
const debug = true;

// User agent for sidebar search results
const contextsearch_userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1';
const DEFAULT_SEARCH_ENGINES = 'defaultSearchEngines.json';
const googleLensUrl = 'https://lens.google.com/uploadbyurl?url=';
const googleReverseImageSearchUrl =
    'https://www.google.com/searchbyimage?sbisrc=1&safe=off&image_url=';
const chatGPTUrl = 'https://chat.openai.com/';
const googleBardUrl = 'https://bard.google.com/';
const perplexityAIUrl = 'https://www.perplexity.ai/';
const base64ContextSearchIcon =
    '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';
// Folder icon download link: https://icons8.com/icon/12160/folder
const base64FolderIcon = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nO2VMWrDQBBFp8gRQhoFV5a0pM0Zci/fRAK7CcJd0gXcRfKALxFIZ4OdA+gbxZ1A3nU1A/4Pfv/f7OyuCCGEEDICS3lGJQ1q+UMtSEolC3FTvpZDcnFvErhM/vbyXiRwy9p4lMBQYPUAfGVAVwAabNMVPTazX3w+vaUJDOXb3L64jtLmPT4eX+MCw+Sty+pENrOfuICHtdGpUyj6uIB1Sb0eCoAnELhCV7FeEfASq/2UwWdU7ScNfmTqMxLDuiAooPZTBldI7ScNXmL1GbmHZ/RkXRJT2YZjXGBbrh0LNAkCoYCWe/OyOk55wO5lHhX4l/jOM2h4d7JOp2HyyeUJIYTcFWcLXG7i+rfwxwAAAABJRU5ErkJggg==';

// Advanced feature
const defaultRegex = /[\s\S]*/i;

// This is a RequestFilter: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/RequestFilter
// It matches tabs that aren't attached to a normal location (like a sidebar)
// It only matches embedded iframes
const requestFilter = {
    tabId: -1,
    types: ['main_frame'],
    urls: ['http://*/*', 'https://*/*'],
};

// Constants for translations
const titleMultipleSearchEngines = browser.i18n.getMessage(
    'titleMultipleSearchEngines'
);
const titleSiteSearch = browser.i18n.getMessage('titleSiteSearch');
const titleExactMatch = browser.i18n.getMessage('exactMatch');
const titleOptions = browser.i18n.getMessage('titleOptions');
const windowTitle = browser.i18n.getMessage('windowTitle');
const omniboxDescription = browser.i18n.getMessage('omniboxDescription');
const notifySearchEnginesLoaded = browser.i18n.getMessage(
    'notifySearchEnginesLoaded'
);
const notifySearchEngineAdded = browser.i18n.getMessage(
    'notifySearchEngineAdded'
);
const notifyUsage = browser.i18n.getMessage('notifyUsage');
const notifySearchEngineWithKeyword = browser.i18n.getMessage(
    'notifySearchEngineWithKeyword'
);
const notifyUnknown = browser.i18n.getMessage('notifyUnknown');
const notifySearchEngineUrlRequired = browser.i18n.getMessage(
    'notifySearchEngineUrlRequired'
);

/// Preferences - Default settings
let contextsearch_exactMatch = false;
let contextsearch_tabMode = 'openNewTab';
let contextsearch_optionsMenuLocation = 'bottom';
let contextsearch_openSearchResultsInNewTab = true;
let contextsearch_openSearchResultsInLastTab = false;
let contextsearch_makeNewTabOrWindowActive = false;
let contextsearch_openSearchResultsInNewWindow = false;
let contextsearch_openSearchResultsInSidebar = false;
let contextsearch_displayFavicons = true;
let contextsearch_quickIconGrid = false;
let contextsearch_closeGridOnMouseOut = true;
let contextsearch_disableAltClick = false;
let contextsearch_forceFaviconsReload = false;
let contextsearch_resetPreferences = false;
let contextsearch_forceSearchEnginesReload = false;
let contextsearch_siteSearch = 'Google';
let contextsearch_siteSearchUrl = 'https://www.google.com/search?q=';
let contextsearch_multiMode = 'multiNewWindow';
let contextsearch_privateMode = false;
let contextsearch_openAIAPIKey = '';
let notificationsEnabled = false;

const defaultOptions = {
    exactMatch: contextsearch_exactMatch,
    tabMode: contextsearch_tabMode,
    tabActive: contextsearch_makeNewTabOrWindowActive,
    lastTab: contextsearch_openSearchResultsInLastTab,
    optionsMenuLocation: contextsearch_optionsMenuLocation,
    displayFavicons: contextsearch_displayFavicons,
    quickIconGrid: contextsearch_quickIconGrid,
    closeGridOnMouseOut: contextsearch_closeGridOnMouseOut,
    disableAltClick: contextsearch_disableAltClick,
    forceSearchEnginesReload: contextsearch_forceSearchEnginesReload,
    resetPreferences: contextsearch_resetPreferences,
    forceFaviconsReload: contextsearch_forceFaviconsReload,
    siteSearch: contextsearch_siteSearch,
    siteSearchUrl: contextsearch_siteSearchUrl,
    multiMode: contextsearch_multiMode,
    privateMode: contextsearch_privateMode,
    openAIAPIKey: contextsearch_openAIAPIKey
};

/// Handle Page Action click
browser.pageAction.onClicked.addListener(handlePageAction);

/// Add a mobile header to outgoing requests
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    requestFilter,
    ['blocking', 'requestHeaders']
);

/*
Rewrite the User-Agent header to contextsearch_userAgent
*/
async function rewriteUserAgentHeader(e) {
    if (debug) console.log(e);
    if (!contextsearch_openSearchResultsInSidebar) {
        return {};
    }
    if (debug) {
        const activeTab = await browser.tabs.query({
            currentWindow: true,
            active: true,
        });
        console.log('Active tab: ');
        console.log(activeTab);
        console.log('Intercepted header:');
        console.log(e.requestHeaders);
    }
    for (const header of e.requestHeaders) {
        if (header.name.toLowerCase() === 'user-agent') {
            header.value = contextsearch_userAgent;
        }
    }
    if (debug) {
        console.log('Modified header:');
        console.log(e.requestHeaders);
    }
    return { requestHeaders: e.requestHeaders };
}

/// Handle Incoming Messages
// Functions used to handle incoming messages
function isActive(tab) {
    return tab.active;
}

function queryAllTabs() {
    return browser.tabs.query({ currentWindow: true });
}

async function handleDoSearch(data) {
    const id = data.id;
    if (debug) console.log('Search engine id: ' + id);
    if (debug) console.log(contextsearch_openSearchResultsInSidebar);
    if (contextsearch_openSearchResultsInSidebar) {
        searchUsing(id, null);
        return;
    }
    const tabs = await queryAllTabs();
    const activeTab = tabs.filter(isActive)[0];
    const lastTab = tabs[tabs.length - 1];
    let tabPosition = activeTab.index + 1;
    if (contextsearch_multiMode === 'multiAfterLastTab') {
        tabPosition = lastTab.index + 1;
    }
    if (id === 'multisearch') {
        processMultiTabSearch([], tabPosition);
        return;
    }
    if (contextsearch_openSearchResultsInLastTab) {
        tabPosition = lastTab.index + 1;
    }
    searchUsing(id, tabPosition);
}

async function handleReset() {
    const response = await reset();
    if (debug) console.log(response);
    sendMessageToOptionsPage(response, null);
}

async function handleSaveSearchEngines(data) {
    searchEngines = sortByIndex(data);
    if (debug) console.log(searchEngines);
    await browser.storage.local.clear();
    if (debug) console.log('Local storage cleared.');
    await saveSearchEnginesToLocalStorage(false);
    rebuildContextMenu();
}

async function handleAddNewSearchEngine(data) {
    const id = data.id;
    let domain;
    if (!id.startsWith("separator-")) {
        domain = getDomain(data.searchEngine.url);
        if (debug) console.log(id, domain);
        searchEngines[id] = data.searchEngine;
    }
    searchEngines = sortByIndex(searchEngines);
    await addNewSearchEngine(id, domain);
}

async function handleUpdateSearchOptions(data) {
    const options = await getOptions();
    options.exactMatch = data.exactMatch;
    await setOptions(options, true, false);
}

async function handleUpdateDisplayFavicons(data) {
    const options = await getOptions();
    options.displayFavicons = data.displayFavicons;
    await setOptions(options, true, true);
}

async function handleUpdateQuickIconGrid(data) {
    const options = await getOptions();
    options.quickIconGrid = data.quickIconGrid;
    await setOptions(options, true, false);
}

async function handleUpdateCloseGridOnMouseOut(data) {
    const options = await getOptions();
    options.closeGridOnMouseOut = data.closeGridOnMouseOut;
    await setOptions(options, true, false);
}

async function handleUpdateDisableAltClick(data) {
    const options = await getOptions();
    options.disableAltClick = data.disableAltClick;
    await setOptions(options, true, false);
}

async function handleUpdateTabMode(data) {
    const options = await getOptions();
    options.tabMode = data.tabMode;
    options.tabActive = data.tabActive;
    options.lastTab = data.lastTab;
    options.privateMode = data.privateMode;
    await setOptions(options, true, false);
}

async function handleUpdateMultiMode(data) {
    const options = await getOptions();
    options.multiMode = data.multiMode;
    await setOptions(options, true, false);
}

async function handleUpdateOptionsMenuLocation(data) {
    const options = await getOptions();
    options.optionsMenuLocation = data.optionsMenuLocation;
    await setOptions(options, true, true);
}

async function handleUpdateSiteSearchSetting(data) {
    const options = await getOptions();
    options.siteSearch = data.siteSearch;
    options.siteSearchUrl = data.siteSearchUrl;
    await setOptions(options, true, true);
}

async function handleUpdateResetOptions(data) {
    const options = await getOptions();
    options.forceSearchEnginesReload = data.resetOptions.forceSearchEnginesReload;
    options.resetPreferences = data.resetOptions.resetPreferences;
    options.forceFaviconsReload = data.resetOptions.forceFaviconsReload;
    await setOptions(options, true, false);
}

async function handleUpdateApiKey(data) {
    const options = await getOptions();
    options.openAIAPIKey = data.openAIAPIKey;
    await setOptions(options, true, false);
}

async function handleSaveSearchEnginesToDisk(data) {
    await browser.downloads.download({
        url: data,
        saveAs: true,
        filename: 'searchEngines.json',
    });
}

// Listen for messages from the content or options script
browser.runtime.onMessage.addListener((message, sender) => {
    const action = message.action;
    const data = message.data;
    switch (action) {
        case 'doSearch':
            handleDoSearch(data);
            break;
        case 'notify':
            if (notificationsEnabled) notify(data);
            break;
        case 'setSelection':
            if (debug) console.log(`Selected text: ${data}`);
            if (data) selection = data;
            break;
        case 'reset':
            handleReset();
            break;
        case 'setTargetUrl':
            if (debug) console.log(`TargetUrl: ${data}`);
            if (data) targetUrl = data;
            break;
        case 'testSearchEngine':
            testSearchEngine(data);
            break;
        case 'saveSearchEngines':
            handleSaveSearchEngines(data);
            break;
        case 'addNewSearchEngine':
            handleAddNewSearchEngine(data);
            break;
        case 'updateSearchOptions':
            handleUpdateSearchOptions(data);
            break;
        case 'updateDisplayFavicons':
            handleUpdateDisplayFavicons(data);
            break;
        case 'updateQuickIconGrid':
            handleUpdateQuickIconGrid(data);
            break;
        case 'updateCloseGridOnMouseOut':
            handleUpdateCloseGridOnMouseOut(data);
            break;
        case 'updateDisableAltClick':
            handleUpdateDisableAltClick(data);
            break;
        case 'updateTabMode':
            handleUpdateTabMode(data);
            break;
        case 'updateMultiMode':
            handleUpdateMultiMode(data);
            break;
        case 'updateOptionsMenuLocation':
            handleUpdateOptionsMenuLocation(data);
            break;
        case 'updateSiteSearchSetting':
            handleUpdateSiteSearchSetting(data);
            break;
        case 'updateResetOptions':
            handleUpdateResetOptions(data);
            break;
        case 'updateApiKey':
            handleUpdateApiKey(data);
            break;
        case 'saveSearchEnginesToDisk':
            handleSaveSearchEnginesToDisk(data);
            break;
        case 'hidePageAction':
            browser.pageAction.hide(sender.tab.id);
            break;
        case 'showPageAction':
            browser.pageAction.show(sender.tab.id);
            break;
        default:
            break;
    }
});


/// Initialize extension
// Initialize search engines, only setting to default if not previously set
// Check if options are set in sync storage and set to default if not
async function init() {
    // Debug: verify that storage space occupied is within limits
    if (debug) {
        // Inform on storage space being used by storage sync
        const bytesUsed = await browser.storage.sync
            .getBytesInUse(null)
            .catch((err) => {
                console.error(err);
                console.log('Failed to retrieve storage space used by storage sync.');
            });
        console.log(`Bytes used by storage sync: ${bytesUsed} bytes.`);

        // Inform on storage space being used by local storage
        const items = await browser.storage.local.get(null);
        console.log(
            `Bytes used by local storage: ${JSON.stringify(items).length} bytes.`
        );
    }

    notificationsEnabled =
        (await navigator.permissions.query({ name: 'notifications' })).state ===
        'granted';

    // Fetch CORS API URL and key from config file
    const config = await fetchConfig();
    CORS_API_URL = config.API_URL;
    CORS_API_KEY = config.API_KEY;

    // Initialize options and search engines
    await initialiseOptionsAndSearchEngines();
}

/// Reset extension
// Resets the options to the default list if options.resetPreferences is set
// Resets the list of search engines to the default list if options.forceSearchEnginesReload is set
// Force favicons to be reloaded if options.forceFaviconsReload is set
async function reset() {
    if (debug) {
        console.log(
            "Resetting extension's preferences and search engines as per user reset preferences."
        );
    }
    await initialiseOptionsAndSearchEngines();
    return "resetCompleted";
}

async function addNewSearchEngine(id, domain) {
    const searchEngine = {};
    if (!(id.startsWith("separator-") || id.startsWith("chatgpt-"))) {
        const favicon = await getNewFavicon(id, domain);
        searchEngines[id]['imageFormat'] = favicon.imageFormat;
        searchEngines[id]['base64'] = favicon.base64;
    }
    searchEngine[id] = searchEngines[id];
    await browser.storage.local.set(searchEngine);
    rebuildContextMenu();
    if (notificationsEnabled) notify(notifySearchEngineAdded);
}

function handlePageAction(tab) {
    let message = { action: 'getSearchEngine', data: '' };
    sendMessageToTab(tab, message);
}

async function initialiseOptionsAndSearchEngines() {
    /// Initialise options
    let options = {};
    let data = await browser.storage.sync.get(null).catch((err) => {
        if (debug) {
            console.error(err);
            console.log('Failed to retrieve data from storage sync.');
        }
    });

    if (data.options) {
        options = data.options;
        if (debug) console.log(options);
        delete data['options'];
    }

    // If there are no options stored in storage sync or reset preferences is set, then use default options
    // Otherwise clear storage sync and only save options in storage sync
    if (isEmpty(options) || options.resetPreferences) {
        options = defaultOptions;
    } else {
        await browser.storage.sync.clear();
    }
    if (debug) console.log(options);
    await setOptions(options, true, false);

    /// Initialise search engines
    // If there were search engines stored in storage sync (legacy), move them to storage local
    if (!isEmpty(data) && Object.keys(data).length > 1) {
        searchEngines = sortByIndex(data);
        setKeyboardShortcuts();
        if (debug) {
            console.log('Search engines: \n');
            console.log(searchEngines);
        }
        await browser.storage.local.clear();
        await getFaviconsAsBase64Strings();
        await saveSearchEnginesToLocalStorage(false);
    } else {
        // Check for search engines in local storage
        const se = await browser.storage.local.get(null);
        if (se === undefined || isEmpty(se) || contextsearch_forceSearchEnginesReload) {
            // Load default search engines if force reload is set or if no search engines are stored in local storage
            await browser.storage.local.clear();
            await loadDefaultSearchEngines(DEFAULT_SEARCH_ENGINES);
        } else {
            searchEngines = sortByIndex(se);
            setKeyboardShortcuts();
            await getFaviconsAsBase64Strings();
            await saveSearchEnginesToLocalStorage(true);
            rebuildContextMenu();
            if (debug) {
                console.log('Search engines: \n');
                console.log(searchEngines);
            }
        }
    }
}

function setKeyboardShortcuts() {
    for (let id in searchEngines) {
        if (searchEngines[id].keyboardShortcut !== undefined) continue;
        if (debug) console.log(`id: ${id}`);
        searchEngines[id]['keyboardShortcut'] = '';
        if (debug)
            console.log(`keyboard shortcut: ${searchEngines[id].keyboardShortcut}`);
    }
}

function getOptions() {
    return browser.storage.sync.get(null)
        .then(data => {
            const options = data.options;
            if (debug) console.log('Preferences retrieved from sync storage:');
            if (debug) console.log(options);
            return options;
        })
        .catch(err => {
            if (debug) {
                console.error(err);
                console.log('Failed to retrieve options from sync storage.');
            }
            return err;
        });
}

// Sets the default options if they haven't already been set in local storage and saves them
// The context menu is also rebuilt when required
function setOptions(options, save, rebuildContextMenu) {
    if (debug) console.log(`Setting exact match to ${options.exactMatch}`);
    contextsearch_exactMatch = options.exactMatch;

    if (debug) console.log('Setting tab mode..');
    contextsearch_makeNewTabOrWindowActive = options.tabActive;
    contextsearch_openSearchResultsInLastTab = options.lastTab;
    contextsearch_privateMode = options.privateMode;
    switch (options.tabMode) {
        case 'openNewTab':
            contextsearch_openSearchResultsInNewTab = true;
            contextsearch_openSearchResultsInNewWindow = false;
            contextsearch_openSearchResultsInSidebar = false;
            break;
        case 'sameTab':
            contextsearch_openSearchResultsInNewTab = false;
            contextsearch_openSearchResultsInNewWindow = false;
            contextsearch_openSearchResultsInSidebar = false;
            break;
        case 'openNewWindow':
            contextsearch_openSearchResultsInNewWindow = true;
            contextsearch_openSearchResultsInNewTab = false;
            contextsearch_openSearchResultsInSidebar = false;
            break;
        case 'openSidebar':
            contextsearch_openSearchResultsInSidebar = true;
            contextsearch_openSearchResultsInNewTab = false;
            contextsearch_openSearchResultsInNewWindow = false;
            break;
        default:
            break;
    }

    if (debug) console.log(
        `Setting the position of options in the context menu to ${options.optionsMenuLocation}`
    );
    contextsearch_optionsMenuLocation = options.optionsMenuLocation;

    if (debug) console.log('Setting favicons preference..');
    contextsearch_displayFavicons = options.displayFavicons;

    if (debug) console.log('Setting Icons Grid options..');
    contextsearch_quickIconGrid = options.quickIconGrid;
    contextsearch_closeGridOnMouseOut = options.closeGridOnMouseOut;
    contextsearch_disableAltClick = options.disableAltClick;

    if (debug) console.log('Setting site search option..');
    contextsearch_siteSearch = options.siteSearch;
    contextsearch_siteSearchUrl = options.siteSearchUrl;

    if (debug) console.log(`Setting reset options..`);
    contextsearch_forceSearchEnginesReload = options.forceSearchEnginesReload;
    contextsearch_resetPreferences = options.resetPreferences;
    contextsearch_forceFaviconsReload = options.forceFaviconsReload;

    contextsearch_multiMode = options.multiMode;

    contextsearch_openAIAPIKey = options.openAIAPIKey;

    if (save) {
        saveOptions(options, rebuildContextMenu);
    }

    return Promise.resolve();
}

function saveOptions(options, blnRebuildContextMenu) {
    return browser.storage.sync.set({ options })
        .then(() => {
            if (debug) console.log(options);
            if (blnRebuildContextMenu) rebuildContextMenu();
            if (debug) console.log('Successfully saved the options to storage sync.');
        })
        .catch(err => {
            if (debug) {
                console.error(err);
                console.log('Failed to save options to storage sync.');
            }
        });
}

/// Load default list of search engines
async function loadDefaultSearchEngines(jsonFile) {
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'application/json');
    const initObject = {
        method: 'GET',
        headers: reqHeader,
    };
    let userRequest = new Request(jsonFile, initObject);
    try {
        const response = await fetch(userRequest);
        if (!response.ok) {
            const message = `The search engines could not be loaded. An error has occured: ${response.status}`;
            throw new Error(message);
        }
        const json = await response.json();
        searchEngines = sortByIndex(json);
        setKeyboardShortcuts();
        if (debug) {
            console.log('Search engines:\n');
            console.log(searchEngines);
        }
        await browser.storage.local.clear();
        await getFaviconsAsBase64Strings();
        await saveSearchEnginesToLocalStorage(true);
        rebuildContextMenu();
    } catch (error) {
        if (debug) console.error(error.message);
    }
}

async function saveSearchEnginesToLocalStorage(blnNotify) {
    searchEngines = sortByIndex(searchEngines);
    if (debug) {
        console.log('Search engines:\n');
        console.log(searchEngines);
    }

    try {
        // save list of search engines to local storage
        await browser.storage.local.set(searchEngines);
        if (notificationsEnabled && blnNotify) notify(notifySearchEnginesLoaded);
        if (debug) {
            console.log(
                'Search engines have been successfully saved to local storage.'
            );
        }
    } catch (error) {
        if (debug) {
            console.error(error.message);
            console.log('Failed to save the search engines to local storage.');
        }
    }
}

/// Fetch and store favicon image format and base64 representation to searchEngines
async function getFaviconsAsBase64Strings() {
    if (debug) console.log('Fetching favicons..');
    let arrayOfPromises = [];

    for (let id in searchEngines) {
        // Fetch a new favicon only if there is no existing favicon or if an favicon reload is being forced
        if (
            searchEngines[id].base64 === null ||
            searchEngines[id].base64 === undefined ||
            contextsearch_forceFaviconsReload
        ) {
            let seUrl = searchEngines[id].url;
            if (debug) console.log('id: ' + id);
            if (debug) console.log('url: ' + seUrl);
            let domain = getDomain(seUrl);
            if (debug) console.log('Getting favicon for ' + domain);
            arrayOfPromises.push(await getNewFavicon(id, domain));
        }
    }

    if (arrayOfPromises.length > 0) {
        // values is an array of {id:, imageFormat:, base64:}
        const values = await Promise.all(arrayOfPromises).catch((err) => {
            if (debug) {
                console.error(err);
                console.log('Not ALL the favcions could be fetched.');
            }
            return;
        });
        if (debug) console.log('ALL promises have completed.');
        if (values === undefined) return;
        for (let value of values) {
            if (debug) {
                console.log('================================================');
                console.log('id is ' + value.id);
                console.log('------------------------------------------------');
                console.log('image format is ' + value.imageFormat);
                console.log('------------------------------------------------');
                console.log('base64 string is ' + value.base64);
                console.log('================================================');
            }
            searchEngines[value.id]['imageFormat'] = value.imageFormat;
            searchEngines[value.id]['base64'] = value.base64;
        }
        if (debug) console.log('The favicons have ALL been fetched.');
    }
}

async function getNewFavicon(id, domain) {
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'text/plain; charset=UTF-8');
    reqHeader.append('x-api-key', CORS_API_KEY);
    const initObject = {
        method: 'GET',
        headers: reqHeader,
    };
    const userRequest = new Request(CORS_API_URL + domain, initObject);
    try {
        const response = await fetch(userRequest);
        if (!response.ok) {
            const message = `Failed to get domain of search engine. An error has occured: ${response.status}`;
            throw new Error(message);
        }
        if (debug) console.log(response);
        const data = await response.json();
        let imageFormat = data.imageFormat;
        let b64 = data.b64;
        if (b64 === '') {
            b64 = base64ContextSearchIcon;
            imageFormat = 'image/png';
        }
        if (debug) console.log(imageFormat, b64);
        return { id: id, imageFormat: imageFormat, base64: b64 };
    } catch (error) {
        if (debug) console.error(error.message);
        if (debug) console.log('Failed to retrieve new favicon.');
        // Failed to retrieve a favicon, proceeding with default CS icon
        return { id: id, imageFormat: 'image/png', base64: base64ContextSearchIcon };
    }
}

function convertUrl2AbsUrl(href, domain) {
    let url = href;
    let absUrl = domain;
    let urlParts = [];

    // If the url is absolute, i.e. begins with either'http' or 'https', there's nothing to do!
    if (/^(https?:\/\/)/.test(url)) return url;

    if (url.includes('moz-extension://')) {
        let i = url.lastIndexOf('moz-extension://') + 16;
        url = url.substr(i);
        urlParts = url.split(/\//);
        urlParts.shift();
        for (let urlPart of urlParts) {
            absUrl += '/' + urlPart;
        }
        return absUrl;
    }

    // If url begins with '//'
    if (/^(\/\/)/.test(url)) {
        return 'https:' + url;
    }

    // If url is relative...
    // If url begings with either './' or '/' (excluding './/' or '//')
    if (/^([.]\/|\/)[^/]/.test(url)) {
        urlParts = url.split(/\//);
        urlParts.shift();
    } else if (/^[^/]/.test(url)) {
        // url does not begin with '/'
        urlParts = url.split(/\//);
    }
    for (let urlPart of urlParts) {
        absUrl += '/' + urlPart;
    }
    return absUrl;
}

/// Rebuild the context menu using the search engines from local storage
function rebuildContextMenu() {
    if (debug) console.log('Rebuilding context menu..');
    browser.runtime.getBrowserInfo().then((info) => {
        const v = info.version;
        const browserVersion = parseInt(v.slice(0, v.search('.') - 1));

        browser.contextMenus.removeAll();
        browser.contextMenus.onClicked.removeListener(processSearch);

        if (contextsearch_optionsMenuLocation === 'top') {
            rebuildContextOptionsMenu();
        }

        buildContextMenuForImages();

        let n = Object.keys(searchEngines).length;
        for (let i = 1; i < n + 1; i++) {
            for (let id in searchEngines) {
                if (searchEngines[id].index === i) {
                    if (debug) console.log(`Index: ${i}  id: ${id}`);
                    if (id.startsWith("separator-")) {
                        browser.contextMenus.create({
                            id: 'cs-separator-' + i,
                            type: 'separator',
                            contexts: ['selection'],
                        });
                        break;
                    }

                    const strId = 'cs-' + id;
                    const strTitle = searchEngines[id].name;
                    const base64String = searchEngines[id].base64;

                    buildContextMenuItem(
                        searchEngines[id],
                        strId,
                        strTitle,
                        base64String,
                        browserVersion
                    );
                }
            }
        }

        if (contextsearch_optionsMenuLocation === 'bottom') {
            rebuildContextOptionsMenu();
        }

        browser.contextMenus.onClicked.addListener(processSearch);
    });
}

function rebuildContextOptionsMenu() {
    if (contextsearch_optionsMenuLocation === 'bottom') {
        browser.contextMenus.create({
            id: 'cs-separator',
            type: 'separator',
            contexts: ['selection'],
        });
    }
    browser.contextMenus.create({
        id: 'cs-match',
        type: 'checkbox',
        title: titleExactMatch,
        contexts: ['selection'],
        checked: contextsearch_exactMatch,
    });
    browser.contextMenus.create({
        id: 'cs-multitab',
        title: titleMultipleSearchEngines,
        contexts: ['selection'],
    });
    browser.contextMenus.create({
        id: 'cs-site-search',
        title: `${titleSiteSearch} ${contextsearch_siteSearch}`,
        contexts: ['selection'],
    });
    browser.contextMenus.create({
        id: 'cs-options',
        title: titleOptions + '...',
        contexts: ['selection'],
    });
    if (contextsearch_optionsMenuLocation === 'top') {
        browser.contextMenus.create({
            id: 'cs-separator',
            type: 'separator',
            contexts: ['selection'],
        });
    }
}

/// Build the context menu for image searches
function buildContextMenuForImages() {
    browser.contextMenus.create({
        id: 'cs-reverse-image-search',
        title: 'Google Reverse Image Search',
        contexts: ['image'],
    });
    browser.contextMenus.create({
        id: 'cs-google-lens',
        title: 'Google Lens',
        contexts: ['image'],
    });
}

/// Build a single context menu item
function buildContextMenuItem(
    searchEngine,
    index,
    title,
    base64String,
    browserVersion
) {
    const imageFormat = searchEngine.imageFormat;
    const contexts = ['selection'];
    const faviconUrl = `data:${imageFormat};base64,${base64String}`;
    const regexString = searchEngine.regex.body;
    const regexModifier = searchEngine.regex.flags;
    const regex = new RegExp(regexString, regexModifier);
    if (!searchEngine.show) return;
    // if (debug){
    // 	console.log(regexString);
    // 	console.log(regexModifier);
    // 	console.log(selection.match(regex));
    // }
    if (contextsearch_useRegex && selection.match(regex) === null) return;
    if (browserVersion >= 56 && contextsearch_displayFavicons === true) {
        browser.contextMenus.create({
            id: index,
            title: title,
            contexts: contexts,
            icons: { 20: faviconUrl },
        });
    } else {
        browser.contextMenus.create({
            id: index,
            title: title,
            contexts: contexts,
        });
    }
}

// Perform search based on selected search engine, i.e. selected context menu item
async function processSearch(info, tab) {
    if (debug) console.log(info);
    const id = info.menuItemId.replace('cs-', '');
    let tabIndex, tabPosition;

    if (info.selectionText !== undefined) {
        // Prefer info.selectionText over selection received by content script for these lengths (more reliable)
        if (info.selectionText.length < 150 || info.selectionText.length > 150) {
            selection = info.selectionText.trim();
        }
    }

    if (
        contextsearch_openSearchResultsInSidebar &&
        id !== 'reverse-image-search' &&
        id !== 'google-lens'
    ) {
        await browser.sidebarAction.open();
        await browser.sidebarAction.setPanel({ panel: '' });
    } else {
        await browser.sidebarAction.close();
        tabIndex = tab.index + 1;
    }
    const tabs = await browser.tabs.query({ currentWindow: true });
    tabPosition = tabs[tabs.length - 1].index + 1;
    if (contextsearch_openSearchResultsInLastTab) tabIndex = tabPosition;
    if (contextsearch_multiMode !== 'multiAfterLastTab') {
        tabPosition = tabIndex + 1;
    }
    if (id === 'reverse-image-search') {
        if (debug) console.log(targetUrl);
        displaySearchResults(googleReverseImageSearchUrl + targetUrl, tabIndex);
        return;
    }
    if (id === 'google-lens') {
        if (debug) console.log(targetUrl);
        displaySearchResults(googleLensUrl + targetUrl, tabIndex);
        return;
    }
    if (id === 'site-search' && !isEmpty(targetUrl)) {
        if (debug) console.log(targetUrl);
        if (contextsearch_openSearchResultsInSidebar) {
            const domain = getDomain(tab.url).replace(/https?:\/\//, '');
            const options = await getOptions();
            targetUrl =
                options.siteSearchUrl +
                encodeUrl(`site:https://${domain} ${selection}`);
            browser.sidebarAction.setPanel({ panel: targetUrl });
            browser.sidebarAction.setTitle({ title: 'Search results' });
            return;
        } else {
            displaySearchResults(targetUrl, tabIndex);
            return;
        }
    } else if (id === 'options') {
        browser.runtime.openOptionsPage().then(null, onError);
        return;
    } else if (id === 'multitab') {
        processMultiTabSearch([], tabPosition);
        return;
    } else if (id === 'match') {
        getOptions().then((settings) => {
            let options = settings.options;
            if (debug) {
                console.log(
                    `Preferences retrieved from sync storage: ${JSON.stringify(options)}`
                );
            }
            options.exactMatch = !contextsearch_exactMatch;
            if (options.exactMatch) {
                if (debug) console.log(`Setting exact match to ${options.exactMatch}`);
                contextsearch_exactMatch = options.exactMatch;
            }
            saveOptions(options, true);
        });
        return;
    }

    if (!id.startsWith("separator-")) {
        searchUsing(id, tabIndex);
    }
}

async function processMultiTabSearch(arraySearchEngineUrls, tabPosition) {
    const data = await browser.storage.local.get(null);
    searchEngines = sortByIndex(data);
    let multiTabSearchEngineUrls = [];
    if (arraySearchEngineUrls.length > 1) {
        multiTabSearchEngineUrls = arraySearchEngineUrls;
    } else {
        for (let id in searchEngines) {
            if (searchEngines[id].multitab) {
                multiTabSearchEngineUrls.push(
                    getSearchEngineUrl(searchEngines[id].url, selection)
                );
            }
        }
    }
    if (notificationsEnabled && isEmpty(multiTabSearchEngineUrls)) {
        notify('Search engines have not been selected for a multi-search.');
        return;
    }
    const n = multiTabSearchEngineUrls.length;
    if (debug) console.log(multiTabSearchEngineUrls);
    if (contextsearch_multiMode === 'multiNewWindow') {
        await browser.windows.create({
            titlePreface: windowTitle + "'" + selection + "'",
            url: multiTabSearchEngineUrls,
            incognito: contextsearch_privateMode,
        });
    } else {
        for (let i = 0; i < n; i++) {
            await browser.tabs.create({
                index: tabPosition + i,
                url: multiTabSearchEngineUrls[i],
            });
        }
    }
}

// Handle search terms if there are any
function getSearchEngineUrl(searchEngineUrl, sel) {
    let quote = '';
    if (contextsearch_exactMatch) quote = '%22';
    if (searchEngineUrl.includes('{searchTerms}')) {
        return searchEngineUrl.replace(/{searchTerms}/g, encodeUrl(sel));
    } else if (searchEngineUrl.includes('%s')) {
        return searchEngineUrl.replace(/%s/g, encodeUrl(sel));
    } else {
        return searchEngineUrl + quote + encodeUrl(sel) + quote;
    }
}

function searchUsing(id, tabIndex) {
    const searchEngineUrl = searchEngines[id].url;

    targetUrl = getSearchEngineUrl(searchEngineUrl, selection);
    if (debug) console.log(`Target url: ${targetUrl}`);
    if (contextsearch_openSearchResultsInSidebar) {
        browser.sidebarAction.setPanel({ panel: targetUrl + '#_sidebar' });
        browser.sidebarAction.setTitle({ title: 'Search results' });
        return;
    }
    displaySearchResults(targetUrl, tabIndex);
}

// Display the search results
async function displaySearchResults(targetUrl, tabPosition) {
    if (debug) console.log('Tab position: ' + tabPosition);
    const windowInfo = await browser.windows.getCurrent({ populate: false });
    const currentWindowID = windowInfo.id;
    if (contextsearch_openSearchResultsInNewWindow) {
        await browser.windows.create({
            url: targetUrl,
            incognito: contextsearch_privateMode,
        });
        if (!contextsearch_makeNewTabOrWindowActive) {
            await browser.windows.update(currentWindowID, { focused: true });
        }
    } else if (contextsearch_openSearchResultsInNewTab) {
        browser.tabs.create({
            active: contextsearch_makeNewTabOrWindowActive,
            index: tabPosition,
            url: targetUrl,
        });
    } else {
        // Open search results in the same tab
        if (debug) {
            console.log('Opening search results in same tab, url is ' + targetUrl);
        }
        browser.tabs.update({ url: targetUrl });
    }
}

/// OMNIBOX
// Provide help text to the user
browser.omnibox.setDefaultSuggestion({
    description: omniboxDescription,
});

// Update the suggestions whenever the input is changed
browser.omnibox.onInputChanged.addListener((input, suggest) => {
    if (input.indexOf(' ') > 0) {
        let suggestion = buildSuggestion(input);
        if (debug) console.log(JSON.stringify(suggestion));
        if (suggestion.length === 1) {
            suggest(suggestion);
        }
    }
});

// Open the page based on how the user clicks on a suggestion
browser.omnibox.onInputEntered.addListener(async (input) => {
    if (debug) console.log(input);
    let tabIndex, tabPosition, tabId;

    const activeTab = await browser.tabs.query({
        currentWindow: true,
        active: true,
    });
    tabIndex = activeTab[0].index;
    tabId = activeTab[0].id;

    const tabs = await browser.tabs.query({ currentWindow: true });
    if (contextsearch_openSearchResultsInLastTab) {
        tabIndex = tabs.length + 1;
    }

    if (debug) console.log(contextsearch_multiMode);
    if (contextsearch_multiMode === 'multiAfterLastTab') {
        tabPosition = tabs.length + 1;
    } else {
        tabPosition = tabIndex + 1;
    }

    if (debug) console.log(tabPosition);
    if (debug) console.log(input.indexOf('://'));

    // Only display search results when there is a valid link inside of the url variable
    if (input.indexOf('://') > -1) {
        if (debug) console.log('Processing search...');
        displaySearchResults(input, tabIndex);
    } else {
        try {
            const keyword = input.split(' ')[0];
            const searchTerms = input.replace(keyword, '').trim();
            const suggestion = buildSuggestion(input);
            switch (keyword) {
                case '.':
                    browser.runtime.openOptionsPage();
                    break;
                case '!':
                    processMultiTabSearch([], tabPosition);
                    break;
                case 'bookmarks':
                case '!b':
                    if (searchTerms === 'recent') {
                        bookmarkItems = await browser.bookmarks.getRecent(10);
                    } else {
                        bookmarkItems = await browser.bookmarks.search({
                            query: searchTerms,
                        });
                    }
                    if (debug) console.log(bookmarkItems);
                    await browser.storage.local.set({
                        bookmarkItems: bookmarkItems,
                        searchTerms: searchTerms,
                    });
                    await browser.tabs.create({
                        active: contextsearch_makeNewTabOrWindowActive,
                        index: tabPosition,
                        url: '/bookmarks.html',
                    });
                    break;
                case 'history':
                case '!h':
                    historyItems = await browser.history.search({ text: searchTerms });
                    await browser.storage.local.set({
                        historyItems: historyItems,
                        searchTerms: searchTerms,
                    });
                    await browser.tabs.create({
                        active: contextsearch_makeNewTabOrWindowActive,
                        index: tabPosition,
                        url: '/history.html',
                    });
                    break;
                default:
                    if (suggestion.length > 1) {
                        let arraySearchEngineUrls = [];
                        for (const s of suggestion) {
                            arraySearchEngineUrls.push(s.content);
                        }
                        processMultiTabSearch(arraySearchEngineUrls, tabPosition);
                    }
                    else if (suggestion.length === 1) {
                        displaySearchResults(suggestion[0].content, tabIndex);
                    } else {
                        browser.search.search({ query: searchTerms, tabId: tabId });
                        if (notificationsEnabled) notify(notifyUsage);
                    }
                    break;
            }
        } catch (error) {
            if (debug) console.error(error);
            if (debug) console.log('Failed to process ' + input);
        }
    }
});

function buildSuggestion(text) {
    let result = [];
    let quote = '';

    if (contextsearch_exactMatch) quote = '%22';

    // Only make suggestions available and check for existence of a search engine when there is a space.
    if (text.indexOf(' ') === -1) {
        lastAddressBarKeyword = '';
        return result;
    }

    let keyword = text.split(' ')[0];
    let searchTerms = text.replace(keyword, '').trim();
    if (debug) console.log(searchTerms);

    // Don't notify for the same keyword
    let showNotification = true;
    if (lastAddressBarKeyword == keyword) showNotification = false;
    lastAddressBarKeyword = keyword;

    if (keyword === '!') {
        selection = searchTerms;
        let suggestion = [
            {
                content: '',
                description: 'Perform multisearch for ' + searchTerms,
            },
        ];
        return suggestion;
    } else if (keyword === '.') {
        let suggestion = [
            {
                content: '',
                description: 'Open options page',
            },
        ];
        return suggestion;
    } else if (keyword === '!b' || keyword === 'bookmarks') {
        let suggestion = [
            {
                content: '',
                description: 'Search bookmarks',
            },
        ];
        return suggestion;
    } else if (keyword === '!h' || keyword === 'history') {
        let suggestion = [
            {
                content: '',
                description: 'Search history',
            },
        ];
        return suggestion;
    }

    for (let id in searchEngines) {
        if (searchEngines[id].keyword === keyword) {
            let suggestion = {};
            let searchEngineUrl = searchEngines[id].url;
            if (searchEngineUrl.includes('{searchTerms}')) {
                targetUrl = searchEngineUrl.replace(
                    /{searchTerms}/g,
                    encodeUrl(searchTerms)
                );
            } else if (searchEngineUrl.includes('%s')) {
                targetUrl = searchEngineUrl.replace(/%s/g, encodeUrl(searchTerms));
            } else {
                targetUrl = searchEngineUrl + quote + encodeUrl(searchTerms) + quote;
            }
            suggestion['content'] = targetUrl;
            suggestion['description'] =
                'Search ' + searchEngines[id].name + ' for ' + searchTerms;
            if (debug) console.log(JSON.stringify(suggestion));
            result.push(suggestion);
        }
    }

    // If no known keyword was found
    if (notificationsEnabled && showNotification) {
        notify(notifySearchEngineWithKeyword + ' ' + keyword + ' ' + notifyUnknown);
    }

    return result;
}

/// Helper functions

// Test if a search engine performing a search for the keyword 'test' returns valid results
function testSearchEngine(engineData) {
    if (engineData.url != '') {
        let tempTargetUrl = getSearchEngineUrl(engineData.url, 'test');
        browser.tabs.create({
            url: tempTargetUrl,
        });
    } else if (notificationsEnabled) {
        notify(notifySearchEngineUrlRequired);
    }
}

/// Generic Error Handler
function onError(error) {
    if (debug) console.error(`${error}`);
}

/// Encode a url
function encodeUrl(url) {
    if (isEncoded(url)) {
        return url;
    }
    return encodeURIComponent(url);
}

/// Verify if uri is encoded
function isEncoded(uri) {
    let test = '';
    try {
        test = uri !== decodeURIComponent(uri);
        return test;
    } catch (e) {
        return false;
    }
}

/// Send message to content scripts
async function sendMessageToTab(tab, message) {
    const tabId = tab.id;
    await browser.tabs.sendMessage(tabId, message).catch((err) => {
        if (debug) {
            console.error(err);
            console.log(`Failed to send message ${JSON.stringify(message)} to:\n`);
            console.log(`Tab ${tab.id}: ${tab.title}\n`);
        }
        return;
    });
    if (debug) {
        console.log(`Successfully sent message to:\n`);
        console.log(`Tab ${tab.id}: ${tab.title}\n`);
    }
}

/// Send message to options page
async function sendMessageToOptionsPage(action, data) {
    await browser.runtime.sendMessage({ action: action, data: JSON.parse(JSON.stringify(data)) })
        .catch(e => {
            if (debug) console.error(e);
        });
}

/// Notifications
function notify(message) {
    browser.notifications.create(message.substring(0, 20), {
        type: 'basic',
        iconUrl: 'icons/icon_64.png',
        title: browser.i18n.getMessage('extensionName'),
        message: message,
    });
}

/// Get the domain of a given url
function getDomain(url) {
    let protocol = '';
    if (url.indexOf('://') !== -1) {
        protocol = url.split('://')[0] + '://';
    } else {
        // By default, set the protocol to 'https://' if it hasn't been set
        protocol = 'https://';
    }

    let urlParts = url
        .replace('http://', '')
        .replace('https://', '')
        .split(/[/?#]/);
    let domain = protocol + urlParts[0];
    return domain;
}

/// Sort search engines by index
function sortByIndex(list) {
    let sortedList = JSON.parse(JSON.stringify(list));
    let n = Object.keys(list).length;
    let arrayOfIndexes = [];
    let arrayOfIds = [];
    let min = 0;
    // Create the array of indexes and its corresponding array of ids
    for (let id in list) {
        if (debug) console.log(`id = ${id}`);
        // If there is no index, then move the search engine to the end of the list
        if (isEmpty(list[id].index)) {
            list[id].index = n + 1;
            n++;
        }
        arrayOfIndexes.push(list[id].index);
        arrayOfIds.push(id);
    }
    // Sort the list by index
    for (let i = 1; i < n + 1; i++) {
        min = Math.min(...arrayOfIndexes);
        let ind = arrayOfIndexes.indexOf(min);
        arrayOfIndexes.splice(ind, 1);
        let id = arrayOfIds.splice(ind, 1);
        sortedList[id].index = i;
    }

    return sortedList;
}

// Test if an object is empty
function isEmpty(value) {
    if (typeof value === 'number') return false;
    else if (typeof value === 'string') return value.trim().length === 0;
    else if (Array.isArray(value)) return value.length === 0;
    else if (typeof value === 'object') {
        return value === null || Object.keys(value).length === 0;
    } else if (typeof value === 'boolean') return false;
    else return !value;
}

// 
async function fetchConfig() {
    const response = await fetch(browser.runtime.getURL('config.json'));
    const config = await response.json();
    return config;
}

init();