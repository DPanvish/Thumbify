import express from "express";
import { deleteThumbnail, generateThumbnail, getThumbnailById, getUserThumbnails } from "../controllers/ThumbnailController.js";
import protect from "../middlewares/AuthMiddleware.js";

const ThumbnailRouter = express.Router();

ThumbnailRouter.post("/generate", protect, generateThumbnail);
ThumbnailRouter.delete("/delete/:id",protect , deleteThumbnail);
ThumbnailRouter.get("/thumbnails", protect, getUserThumbnails);
ThumbnailRouter.get("/:id", protect, getThumbnailById);

export default ThumbnailRouter;