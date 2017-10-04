let coverage

describe('Check JS coverage', () => {
    before(() => {
        browser.execute('Profiler.enable')
        browser.execute('Debugger.enable')
    })

    it('get coverage data', () => {
        /**
         * start test coverage profiler
         */
        browser.execute('Profiler.startPreciseCoverage', {
            callCount: true,
            detailed: true
        })

        browser.url('http://localhost:8080')

        /**
         * let page settle
         */
        browser.pause(2000)

        /**
         * capture test coverage
         */
        const result = browser.execute('Profiler.takePreciseCoverage')
        coverage = JSON.parse(result.value).result.result.filter((res) => res.url !== '')
    })

    it('print coverage data', () => {
        console.log(JSON.stringify(coverage, null, 4))

        const scriptId = coverage[0].scriptId
        const script = JSON.parse(
            browser.execute('Debugger.getScriptSource', { scriptId }).value
        ).result.scriptSource

        for (const func of coverage[0].functions) {
            console.log('\nFunction name:', func.functionName ? func.functionName : '<empty>')
            for (const range of func.ranges) {
                if (range.count) continue
                console.log('Not executed:\n"', script.slice(range.startOffset, range.endOffset), '"');
            }
        }
    })

    after(() => {
        /**
         * stop profiler
         */
        browser.execute('Profiler.stopPreciseCoverage')
    })
})
