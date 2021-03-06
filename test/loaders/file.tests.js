var assert = require('chai').assert
var file = require('../../lib/loaders/file')
var fs = require('fs')
var EventEmitter = require('events').EventEmitter

describe('file', function() {

    var confabulous
    var id = Math.floor(Math.random() * 10000000)
    var doomed = 'test/data/delete-me-' + id + '.json'

    beforeEach(function() {
        confabulous = new EventEmitter()
    })

    afterEach(function() {
        confabulous.emit('reloading')
        confabulous.removeAllListeners()
        fs.writeFileSync('test/data/config.json', JSON.stringify({ loaded: "loaded" }, null, 2))
        try { fs.unlinkSync(doomed) } catch(err) {}
    })

    it('should require path when mandatory', function(done) {
        file()(confabulous, function(err, config) {
            assert(err)
            assert.equal(err.message, 'path is required')
            done()
        })
    })

    it('should load configuration', function(done) {
        file({ path: 'test/data/config.json' })(confabulous, function(err, text) {
            assert.ifError(err)
            var config = JSON.parse(text)
            assert.equal(config.loaded, 'loaded')
            done()
        })
    })

    it('should report missing files when mandatory', function(done) {
        file({ path: 'does-not-exist.json' })(confabulous, function(err, config) {
            assert(err)
            assert(/ENOENT/.test(err.message), err.message)
            done()
        })
    })

    it('should ignore missing files when not mandatory', function(done) {
        file({ path: 'does-not-exist.json', mandatory: false })(confabulous, function(err, config) {
            assert.equal(err, true)
            done()
        })
    })

    it('should emit change event when content changes', function(done) {
        file({ path: 'test/data/config.json', watch: true })(confabulous, function(err, text) {
            assert.ifError(err)
            var config = JSON.parse(text)
            assert.equal(config.loaded, 'loaded')
            config.updated = new Date().toISOString()
            fs.writeFile('test/data/config.json', JSON.stringify(config, null, 2))
        }).once('change', done)
    })

    it('should emit change event when file is deleted', function(done) {
        fs.writeFileSync(doomed, JSON.stringify({ foo: "bar" }))
        file({ path: doomed, mandatory: false, watch: true })(confabulous, function(err, text) {
            assert.ifError(err)
            fs.unlink(doomed)
        }).once('change', done)
    })

    it('should post-process', function(done) {

        file({ path: 'test/data/config.json' }, [
            function(text, cb) {
                cb(null, JSON.parse(text))
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.loaded, 'loaded')
            done()
        })
    })
})
