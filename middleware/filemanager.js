const multer = require( "multer" );
const path = require( "path" );

/**
 * Multer configuration for file upload
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb( null, path.resolve( __dirname, "../upload" ) );
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

exports.upload = upload;
