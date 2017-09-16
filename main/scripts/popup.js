(function () {
    const resetBtn = document.getElementById('btn-reset')
    resetBtn.onclick = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', method: 'reset' })
        })
    }
})()
