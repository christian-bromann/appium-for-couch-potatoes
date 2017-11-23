let coverage
const stylesheets = {}

describe('Check CSS coverage', () => {
    before(() => {
        browser.cdp('DOM', 'enable')
        browser.cdp('CSS', 'enable')
        browser.cdp('CSS', 'startRuleUsageTracking')
        browser.url('http://localhost:8080')
    })

    it('get coverage data', () => {
        /**
         * start test coverage profiler
         */
        coverage = browser.cdp('CSS', 'takeCoverageDelta')
    })

    it('get stylesheet data', () => {
        for (const cov of coverage.coverage) {
            if (stylesheets[cov.styleSheetId]) {
                stylesheets[cov.styleSheetId].ranges.push(cov)
                continue
            }

            const cssText = browser.cdp('CSS', 'getStyleSheetText', {
                styleSheetId: cov.styleSheetId
            })

            stylesheets[cov.styleSheetId] = {
                text: cssText.text,
                ranges: [cov]
            }
        }
    })

    it('print coverage results', () => {
        for (const [id, data] of Object.entries(stylesheets)) {
            console.log('\n\nNot used styles for stylesheet with ID:', id)
            let textAsArray = data.text.split('')
            let deletedCode = 0

            /**
             * delete used ranges
             */
            for (const range of data.ranges) {
                textAsArray.splice(range.startOffset - deletedCode, range.endOffset - range.startOffset)
                deletedCode += range.endOffset - range.startOffset
            }

            console.log(textAsArray.join(''))
        }
    })
})
