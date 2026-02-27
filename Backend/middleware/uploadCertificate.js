const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "InternPortal";

    if (file.fieldname === "offerLetter") {
      folder = "InternPortal/OfferLetters";
    } else if (file.fieldname === "certificate") {
      folder = "InternPortal/Certificates";
    }

    return {
      folder,
      resource_type: "raw", // IMPORTANT for PDF
      format: "pdf",
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF allowed"), false);
  }
};

module.exports = multer({ storage, fileFilter });