const postcss = require('postcss');
const through2 = require('through2');

module.exports = function(opts) {
    return () => {
        return through2.obj(function(file, encoding, cb) {
            if (file.isNull()) {
                // nothing to do
                return cb(null, file);
            }

            postcss(opts).process(file.contents, {
                from: file.name
            }).then((result) => {
                file.contents = Buffer.from(result.css);

                if (result.error) {
                    this.emit('spearhook:error', {
                        error: result.error,
                        file
                    });
                }

                cb(null, file);
            }).catch(error => {
                this.emit('spearhook:error', { err, file });

                cb(null, file);
            });
        });
    }
};
