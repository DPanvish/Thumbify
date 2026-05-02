import express from "express";
import { deleteThumbnail, generateThumbnail, getThumbnailById, getUserThumbnails } from "../controllers/ThumbnailController.js";

const ThumbnailRouter = express.Router();

ThumbnailRouter.post("/generate", generateThumbnail);
ThumbnailRouter.delete("/delete/:id", deleteThumbnail);
ThumbnailRouter.get("/thumbnails", getUserThumbnails);
ThumbnailRouter.get("/:id", getThumbnailById);

export default ThumbnailRouter;