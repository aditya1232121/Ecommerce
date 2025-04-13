const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dbbhvbusc",
    api_key: "699383142839218",
    api_secret: "zTwjUtQpj9NhklopHZmL-MsQC-4",
    
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 150, crop: "scale" }],
  },
});


const upload = multer({ storage });

module.exports = upload;