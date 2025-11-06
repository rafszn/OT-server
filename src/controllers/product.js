const asyncHandler = require("../lib/asyncHandler");
const CustomError = require("../lib/CustomError");
const createProductSchema = require("../lib/validate/createProductSchema");
const ProductModel = require("../model/product.model");
const v2 = require("../lib/cloudinary");

exports.createProduct = asyncHandler(async (req, res) => {
  if (req.body.variants && typeof req.body.variants === "string") {
    req.body.variants = JSON.parse(req.body.variants);
  }
  const { error, value } = createProductSchema.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const currency = "NGN";

  let imageUrls = [];
  let videoData = null;

  if (req.files && req.files?.productImages) {
    const uploadPromises = req.files.productImages.map((file) => {
      const publicId = `product-${Date.now()}-${file.originalname}`;
      return v2.uploader.upload(file.path, {
        public_id: publicId,
        folder: "owerri-techies/products/images",
      });
    });

    const uploadedResults = await Promise.all(uploadPromises);

    imageUrls = uploadedResults.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));
  }

  if (
    req.files &&
    req.files?.productVideo &&
    req.files.productVideo.length > 0
  ) {
    const videoFile = req.files.productVideo[0];
    const publicId = `product-video-${Date.now()}-${videoFile.originalname}`;

    const uploadedVideo = await v2.uploader.upload(videoFile.path, {
      public_id: publicId,
      resource_type: "video",
    });

    videoData = {
      url: uploadedVideo.secure_url,
      publicId: uploadedVideo.public_id,
    };
  }

  const productData = {
    ...value,
    images: imageUrls,
    video: videoData,
    currency,
  };

  const newProduct = await ProductModel.create(productData);

  res.status(201).json({
    success: true,
    message: "Product item created",
    data: newProduct,
  });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();

  return res.status(200).json({
    success: true,
    message: "products fetched successfully.",
    data: products,
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({ success: true, data: product });
});

