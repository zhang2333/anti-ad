window.onload = function () {
    let antiStyleElement

    const hideElements = (selectors) => {
        let styles = selectors.map(sel => `${sel} { display: none !important; }`).join('\n')
        const elStyle = document.createElement('style')
        elStyle.innerHTML = '/* anti-ad */\n' + styles
        const elHead = document.querySelector('head')
        elHead.appendChild(elStyle)

        return elStyle
    }

    chrome.runtime.onMessage.addListener((msg, sender, send) => {
        switch (msg.method) {
            case 'reset':
                if (antiStyleElement) {
                    document.querySelector('head').removeChild(antiStyleElement)
                    antiStyleElement = null
                }
                break
        }
    })

    chrome.runtime.sendMessage({ method: 'match' }, (resp) => {
        if (resp) {
            antiStyleElement = hideElements(resp.hideSels)
        }
    })
}
