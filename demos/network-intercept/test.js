const CDP = require('chrome-remote-interface')

describe('Network throttle test', () => {
    before(() => {
        browser.cdp('Network', 'enable')
    })

    it('should load page the normal way', () => {
        browser.url('https://www.seleniumconf.de/')
        browser.pause(2000)
    })

    it('should load page with different header image', () => {
        /**
         * we can't intercept assets when they come from cache
         */
        browser.cdp('Network', 'clearBrowserCache')
        browser.cdp('Network', 'setRequestInterception', {
            patterns: [{ urlPattern: 'https://www.seleniumconf.de/img/hero-background.png' }]
        })

        browser.on('Network.requestIntercepted', (params) => {
            const { interceptionId } = params

            if (params.request.url.includes('hero-background.png')) {
                const url = 'http://newsfirst.lk/english/wp-content/uploads/2016/12/hith-father-christmas-lights-iStock_000029514386Large.jpg'
                return browser.cdp('Network', 'continueInterceptedRequest', { interceptionId, url })
            }

            return browser.cdp('Network', 'continueInterceptedRequest', { interceptionId })
        })

        browser.url('https://www.seleniumconf.de/')
        browser.pause(5000)
    })
})
