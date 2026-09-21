import { Router } from "express";
import { CollectionController } from "../controllers/collection.controller.js";
import { validate } from "../middleware/validate.js";
import { getCollectionsValidator, createCollectionValidator, getCollectionValidator, getCollectionSlugValidator, updateCollectionValidator, deleteCollectionValidator } from "../validators/collection.validator.js";
const router = Router();
// ==========================================================
// Create Collection
// ==========================================================
router.post("/", createCollectionValidator, validate, CollectionController.createCollection);
// ==========================================================
// Get All Collections
// ==========================================================
router.get("/", getCollectionsValidator, validate, CollectionController.getAllCollections);
// ==========================================================
// Get Collection By Slug
// ==========================================================
router.get("/slug/:slug", getCollectionSlugValidator, validate, CollectionController.getCollectionBySlug);
// ==========================================================
// Get Collection By ID
// ==========================================================
router.get("/:id", getCollectionValidator, validate, CollectionController.getCollection);
// ==========================================================
// Update Collection By ID
// ==========================================================
router.put("/:id", updateCollectionValidator, validate, CollectionController.updateCollection);
// ==========================================================
// Delete Collection By ID
// ==========================================================
router.delete("/:id", deleteCollectionValidator, validate, CollectionController.deleteCollection);
export default router;
//# sourceMappingURL=collection.routes.js.map