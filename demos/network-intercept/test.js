const CDP = require('chrome-remote-interface')

describe('Network throttle test', () => {
    before(() => {
        browser.execute('Network.enable')
    })
    
    it('should load page the normal way', () => {
        browser.url('https://www.seleniumconf.de/')
        browser.pause(2000)
    })
    
    it('should load page with different header image', () => {
        browser.execute('Network.clearBrowserCache')

        const port = global.driver.chromedriverPort
        const client = browser.call(
            () => new Promise((resolve) => CDP({ port }, resolve))
        )
        
        browser.execute('Network.setRequestInterceptionEnabled', {
            enabled: true,
            patterns: ['https://www.seleniumconf.de/img/hero-background.png']
        })
        
        const { Network } = client
        Network.requestIntercepted((params) => {
            console.log('Intercepted request with URL', params.request.url)
            Network.continueInterceptedRequest({
                interceptionId: params.interceptionId,
                url: 'https://static1.squarespace.com/static/54e8ba93e4b07c3f655b452e/t/590909e2bf629aaad4c385b0/1493764631456/DSC_9423.jpg'
            })
        })
        
        try {
            browser.url('https://www.seleniumconf.de/')
        } catch (e) {
            /**
             * when intercepting requests the command fails due to
             * "unknown error: cannot determine loading status"
             */
        }  
        
        browser.pause(10000)
    })
})