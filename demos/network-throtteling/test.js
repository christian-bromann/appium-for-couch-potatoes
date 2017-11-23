describe('Network throttle test', () => {
    before(() => {
        browser.cdp('Network', 'enable')
    })

    it('should load page the normal way', () => {
        const start = Date.now()
        browser.url('https://www.seleniumconf.de/')
        console.log(`1st page load took ${Date.now() - start}ms`)
    })

    it('should load cached page the normal way again', () => {
        const start = Date.now()
        browser.url('https://www.seleniumconf.de/')
        console.log(`2nd page load (cached) took ${Date.now() - start}ms`)
    })

    it('should load cached page the normal way again', () => {
        const start = Date.now()
        browser.url('https://www.seleniumconf.de/')
        console.log(`3rd page load (cached) took ${Date.now() - start}ms`)
    })

    it('should load not cached page the normal way again', () => {
        browser.cdp('Network', 'clearBrowserCache')
        const start = Date.now()
        browser.url('https://www.seleniumconf.de/')
        console.log(`4th page load (not cached) took ${Date.now() - start}ms`)
    })

    it('should load page with 3G speed', () => {
        browser.cdp('Network', 'clearBrowserCache')
        browser.cdp('Network', 'emulateNetworkConditions', {
            offline: false,
            latency: 0, // ms
            downloadThroughput: 75000, // byte/s
            uploadThroughput: 25000, // byte/s
            connectionType: 'cellular3g'
        })

        const start = Date.now()
        browser.url('https://www.seleniumconf.de/')
        console.log(`5th page load with GPS took ${Date.now() - start}ms`)
    })
})
