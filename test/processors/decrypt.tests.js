var assert = require('chai').assert
var decrypt = require('../../lib/processors/decrypt')

describe('decrypt', function() {
    it('should decrypt config', function() {
        var encrypted = 'aa928aba23d2955dbd8aa6b6d601b4d5a9af55ea4fdf023489b1d45c0b42e5e9e18ff2abfa18b1e0717b513ebcfe4318ada86ea167bef9aafbc7dfb70d81431f115c81e7848a9d35cf24bd1186a75855edd7d46747394ae3a5d30213f700deef34b64e3a3db4ca0734f793d1c4b2ef5b'
        decrypt({ algorithm: 'aes192', password: 'a password'})(encrypted, function(err, config) {
            assert.ifError(err)
            assert.equal(JSON.parse(config).secret, 'loaded')
        })
    })

    it('should validate algorithm', function() {
        var encrypted = 'aa928aba23d2955dbd8aa6b6d601b4d5a9af55ea4fdf023489b1d45c0b42e5e9e18ff2abfa18b1e0717b513ebcfe4318ada86ea167bef9aafbc7dfb70d81431f115c81e7848a9d35cf24bd1186a75855edd7d46747394ae3a5d30213f700deef34b64e3a3db4ca0734f793d1c4b2ef5b'
        decrypt({ password: 'a password'})(encrypted, function(err, config) {
            assert.ok(err)
            assert.equal(err.message, 'algorithm is required')
        })
    })

    it('should validate password', function() {
        var encrypted = 'aa928aba23d2955dbd8aa6b6d601b4d5a9af55ea4fdf023489b1d45c0b42e5e9e18ff2abfa18b1e0717b513ebcfe4318ada86ea167bef9aafbc7dfb70d81431f115c81e7848a9d35cf24bd1186a75855edd7d46747394ae3a5d30213f700deef34b64e3a3db4ca0734f793d1c4b2ef5b'
        decrypt({ algorithm: 'aes192' })(encrypted, function(err, config) {
            assert.ok(err)
            assert.equal(err.message, 'password is required')
        })
    })
})
