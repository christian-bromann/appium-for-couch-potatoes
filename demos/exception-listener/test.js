const assert = require('assert')

let exceptions = []

describe('breakpoint demo', () => {
    beforeEach(() => {
        browser.cdp('Runtime', 'enable')
        browser.on('Runtime.exceptionThrown', (data) => {
            exceptions.push(data.exceptionDetails.exception.description)
        })
    })

    it('should test my app', () => {
        browser.url('http://localhost:8080')
        browser.click('#breakstuff')
    })

    afterEach(() => {
        assert.ok(
            exceptions.length === 0,
            'The test triggered one or multiple JavaScript errors:\n\n' + exceptions.map((error) => error + '\n')
        )
    })
})
