var async = require('async')
  , _ = require('underscore')
  , waaUtils = require('../core/waa')
  , Instrument = require('../core/BaseInstrument')
  , utils = require('../core/utils')
  , initialized = false

module.exports = Instrument.extend({

  init: function(args) {
    Instrument.prototype.init.apply(this, arguments)
    this.patchUrl = args[0]
    this.patch = null
    if (initialized === false) {
      initialized = true
      console.log = fields.log
      Pd.start()
      Pd._glob.audio.setContext(fields.sound.audioContext)
    }
  },

  load: function(done) {
    var self = this
    utils.loadFile({ url: this.patchUrl, responseType: 'text' }, function(err, patchStr) {
      fields.log('Patch ' + self.patchUrl + ' loaded')
      self.patchStr = patchStr
    })
  },

  onStart: function() {
    if (!this.patch) {
      this.patch = Pd.loadPatch(this.patchStr)
    } else this.patch.start()
    this.patch.o(0).obj._gainNode.connect(this.mixer)
  },

  onStop: function() {
    this.patch.stop()
  }

})