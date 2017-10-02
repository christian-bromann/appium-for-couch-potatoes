let coverage
const stylesheets = {}

describe('Check CSS coverage', () => {
    before(() => {
        browser.execute('CSS.enable')
        browser.execute('CSS.startRuleUsageTracking')
        browser.url('http://localhost:8080')
    })

    it('get coverage data', () => {
        /**
         * start test coverage profiler
         */
        const result = browser.execute('CSS.takeCoverageDelta')
        coverage = JSON.parse(result.value)
    })

    it('get stylesheet data', () => {
        for (const cov of coverage.result.coverage) {
            if (stylesheets[cov.styleSheetId]) {
                stylesheets[cov.styleSheetId].ranges.push(cov)
                continue
            }

            const cssText = browser.execute('CSS.getStyleSheetText', {
                styleSheetId: cov.styleSheetId
            }).value

            stylesheets[cov.styleSheetId] = {
                text: JSON.parse(cssText).result.text,
                ranges: [cov]
            }
        }
    })

    it('print coverage results', () => {
        for (const [id, data] of Object.entries(stylesheets)) {
            console.log('Used styles for stylesheet with ID:', id)
            for (const range of data.ranges) {
                console.log('\n', data.text.slice(range.startOffset, range.endOffset));
            }
        }
    })
})
