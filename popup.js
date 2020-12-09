/*

Productivity Booster-- Youtube AdBlocker
Author: @devang1998

Please Provide the Credits if you are Using any Party of this Proprietary Software

*/



document.addEventListener('DOMContentLoaded', () => {
    let modes = {
        autoText: document.querySelector('.auto-icon'),
        blockText: document.querySelector('.block-icon'),
        autoIcon: document.querySelector('.auto'),
        blockIcon: document.querySelector('.block'),
    }

    tabs = {
        features: document.querySelector('.feature-tab'),
        help: document.querySelector('.help-tab'),
        featuresDisplay: document.querySelector('.modal-content'),
        helpDisplay: document.querySelector('.help-content'),
        modalIconsDisplay: document.querySelector('.modal-icons')
    }

    chrome.storage.sync.get('mode', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'mode': 'auto' }, () => setAuto(modes));
        } else if (storage.mode === 'auto') {
            setAuto(modes);
        } else if (storage.mode === 'block') {
            setBlock(modes);
        }
    })

    chrome.storage.sync.get('featuresHelpTab', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'featuresHelpTab': 'features' }, () => loadFeaturesTab());
        } else if (storage.featuresHelpTab === 'features') {
            loadFeaturesTab(false);
        } else if (storage.featuresHelpTab === 'help') {
            loadHelpTab(false);
        }
    })

    chrome.storage.sync.get('autoCount', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'autoCount': 0 }, () => loadAutoCount(0));
        } else {
            loadAutoCount(storage.autoCount);
            chrome.storage.onChanged.addListener(changes => {
                for (key in changes) {
                    if (key === 'autoCount') {
                        loadAutoCount(changes[key].newValue);
                    }
                }
            })
        }
    })

    chrome.storage.sync.get('blockCount', storage => {
        if (Object.entries(storage).length === 0) {
            chrome.storage.sync.set({ 'blockCount': 0 }, () => loadblockCount(0));
        } else {
            loadblockCount(storage.blockCount);
            chrome.storage.onChanged.addListener(changes => {
                for (key in changes) {
                    if (key === 'blockCount') {
                        loadblockCount(changes[key].newValue);
                    }
                }
            })
        }
    })

    const sendData = (mode) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { mode: mode }, function (response) {
                chrome.storage.sync.set({ 'mode': mode }, () => console.log('data saved', mode));
                if (response) {
                    console.log('success', response);
                } else {
                    console.log('please visit a verified url');
                }
            })
        })
    }

    const loadAutoCount = (count) => {
        document.querySelector('.auto-ads-blocked-number').innerText = count;
    }

    const loadblockCount = (count) => {
        document.querySelector('.block-ads-blocked-number').innerText = count;
    }

    const loadFeaturesTab = (setStorage) => {
        console.log('loadedfeaturestab', tabs);
        if (setStorage) {
            chrome.storage.sync.set({ 'featuresHelpTab': 'features' }, () => console.log('features tab saved'));
        }
        tabs.features.classList.add('active');
        tabs.help.classList.remove('active');

        tabs.featuresDisplay.style.display = '';
        tabs.helpDisplay.style.display = 'none';
        tabs.modalIconsDisplay.style.display = '';
    }

    const loadHelpTab = (setStorage) => {
        console.log('loadedhelptab', tabs);
        if (setStorage) {
            chrome.storage.sync.set({ 'featuresHelpTab': 'help' }, () => console.log('help tab saved'));
        }
        tabs.help.classList.add('active');
        tabs.features.classList.remove('active');

        tabs.helpDisplay.style.display = '';
        tabs.featuresDisplay.style.display = 'none';
        tabs.modalIconsDisplay.style.display = 'none';
    }

    const setAuto = (modes) => {
        modes.autoText.classList.add('active');
        modes.autoIcon.classList.add('active');
        modes.blockText.classList.remove('active');
        modes.blockIcon.classList.remove('active');
        document.querySelector('.auto-ads-blocked').style.display = '';
        document.querySelector('.block-ads-blocked').style.display = 'none';
        sendData('auto');
    }

    const setBlock = (modes) => {
        modes.blockText.classList.add('active');
        modes.blockIcon.classList.add('active')
        modes.autoText.classList.remove('active');
        modes.autoIcon.classList.remove('active');
        document.querySelector('.block-ads-blocked').style.display = '';
        document.querySelector('.auto-ads-blocked').style.display = 'none';
        sendData('block');
    }

    const styleBlock = (e) => {
        e.type === 'mouseover'
            ? modes.blockIcon.classList.add('hover')
            : modes.blockIcon.classList.remove('hover')

    }

    styleAuto = (e) => {
        e.type === 'mouseover'
            ? modes.autoIcon.classList.add('hover')
            : modes.autoIcon.classList.remove('hover')
    }

    // Click events for setting modes
    modes.autoText.addEventListener('mousedown', () => setAuto(modes));
    modes.blockText.addEventListener('mousedown', () => setBlock(modes));
    modes.autoIcon.addEventListener('mousedown', () => setAuto(modes));
    modes.blockIcon.addEventListener('mousedown', () => setBlock(modes));

    // Hover events for styling
    modes.blockText.addEventListener('mouseover', (e) => styleBlock(e));
    modes.blockText.addEventListener('mouseleave', (e) => styleBlock(e));
    modes.autoText.addEventListener('mouseover', (e) => styleAuto(e));
    modes.autoText.addEventListener('mouseleave', (e) => styleAuto(e));

    // Click events for viewing features/help tab
    tabs.features.addEventListener('mousedown', () => loadFeaturesTab(true));
    tabs.help.addEventListener('mousedown', () => loadHelpTab(true));
})