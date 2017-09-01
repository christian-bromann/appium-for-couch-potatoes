const lighthouse = require('lighthouse')

let _lhResult

describe('Lighthouse PWA Testing', () => {
    before(() => {
        _lhResult = browser.call(() => lighthouse(
            'https://www.seleniumconf.de',
            {
                port: global.driver.chromedriverPort,
                loadPage: false
            }, {
                passes: [{
                    recordTrace: true,
                    pauseBeforeTraceEndMs: 5000,
                    useThrottling: true,
                    gatherers: [],
                }],
                audits: [
                    'first-meaningful-paint',
                    'first-interactive',
                    'speed-index-metric',
                    'is-on-https'
                ]
            }
        ))
    })

    it('should print lighthouse results', () => {
        for (const metric of Object.keys(_lhResult.audits)) {
            const result = _lhResult.audits[metric]
            console.log(
                `${metric}: ${result.description}\n` +
                `Description: ${result.helpText}\n` +
                `Score: ${result.score}\n`
            )
        }
    })
})
