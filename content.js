/*

Productivity Booster-- Youtube AdBlocker
Author: @devang1998

Please Provide the Credits if you are Using any Party of this Proprietary Software

*/


let currentMode = '';

chrome.storage.sync.get('mode', storage => {
    if (Object.entries(storage).length === 0) {
        currentMode = 'auto';
    } else {
        currentMode = storage.mode;
    }
    runObserver(currentMode);
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    currentMode = request.mode;
    runObserver(request.mode);
    sendResponse({mode: request.mode, success: true});
})

const runObserver = (mode) => {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mode === currentMode) {
                checkSkipBtn(mode);
            }
        })
    })
    observer.observe(document, { childList: true, subtree: true });
}

const checkSkipBtn = (mode) => {
    let skipBtn = {
        'container': document.querySelector('.ytp-ad-skip-button-container'),
        'slot': document.querySelector('.ytp-ad-skip-button-slot')
    }

    if (skipBtn.container) {
        mode === 'auto'
            && handleAuto(skipBtn)
        mode === 'block'
            && handleBlock(skipBtn)
    }
}


const skipAd = (node) => {
    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, false);
        node.container.dispatchEvent(event);
    } else if (document.createEventObject) {
        node.container.fireEvent('onClick');
    } else if (typeof node.container.onclick == 'function') {
        node.container.onclick();
    }
}
//.ytp-ad-overlay-image block overlay ads
const autoCount = () => {
    chrome.storage.sync.get('autoCount', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'autoCount': 1 }, () => console.log('autoCount saved: ', 1));
        } else {
            chrome.storage.sync.set({ 'autoCount': ++storage.autoCount }, () => console.log('autoCount saved: ', storage.autoCount));
        }
    })
}

const handleAuto = (node) => {
    if (node.container.style.display !== 'none') {
        autoCount();
        skipAd(node);
    }
}

const blockCount = () => {
    chrome.storage.sync.get('blockCount', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'blockCount': 1 }, () => console.log('blockCount saved: ', 1));
        } else {
            chrome.storage.sync.set({ 'blockCount': ++storage.blockCount }, () => console.log('blockCount saved: ', storage.blockCount));
        }
    })
}

const handleBlock = (node) => {
    if (node.container.style.display === 'none') {
        node.container.setAttribute('style', 'display: ""');
        node.slot.setAttribute('style', 'display: ""');
        blockCount();
        skipAd(node);
    }
}