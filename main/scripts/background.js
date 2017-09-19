(function() {
    let config = genDefaultConfig()
    
    chrome.storage.sync.get('config', (data) => {
        if (data.config) {
            config = Object.assign({}, genDefaultConfig(), data.config)
        }
    })
    
    chrome.tabs.onUpdated.addListener((id, info, tab) => {
        if (match(config, tab.url)) {
            chrome.pageAction.show(id)
        }
    })
    
    chrome.runtime.onMessage.addListener((msg, sender, send) => {
        switch (msg.method) {
            case 'match':
                send(match(config, sender.url))
                break
        }
    })
    
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.config) {
            config = Object.assign({}, config, changes.config.newValue)
        }
    })
    
    function match (currentConfig, targetUrl) {
        let matched = Object.keys(currentConfig)
            .filter((key) => {
                return !!targetUrl.match(new RegExp(key))
            })
            .map(key => currentConfig[key])
            .reduce((result, next) => {
                let hideSels = (result.hideSels || []).concat(next.hideSels)
                result = Object.assign({}, result, next)
                result.hideSels = hideSels
                return result
            }, {})
        
        return Object.keys(matched).length > 0 ? matched : null
    }
    
    function genDefaultConfig () {
        return {
            'dict.youdao.com': {
                hideSels: ['#wljb', '#doc2', '#baidu-adv', '#topImgAd', '#follow']
            },
            'www.douyu.com': {
                hideSels: ['.lol-ad', '.sq-ad.fl']
            },
            'www.bilibili.com': {
                hideSels: ['.gg-floor-module']
            },
            'weibo.com': {
                hideSels: ['.WB_cardwrap[data-mark]', '[ad-data]']
            }
        }
    }    
})()