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
                const url = 'https://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/t/590909e2bf629aaad4c385b0/1493764631456/DSC_9423.jpg'
                return browser.cdp('Network', 'continueInterceptedRequest', { interceptionId, url })
            }

            return browser.cdp('Network', 'continueInterceptedRequest', { interceptionId })
        })

        browser.url('https://www.seleniumconf.de/')
        browser.pause(5000)
    })
})
