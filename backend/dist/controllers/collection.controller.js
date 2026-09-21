import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CollectionService } from "../services/collection.service.js";
export class CollectionController {
    // ==========================================================
    // Get All Collections
    // ==========================================================
    static getAllCollections = asyncHandler(async (req, res) => {
        const collections = await CollectionService.getAllCollections(req.query);
        return ApiResponse.success(res, "Collections fetched successfully", collections);
    });
    // ==========================================================
    // Get Collection By ID
    // ==========================================================
    static getCollection = asyncHandler(async (req, res) => {
        const collection = await CollectionService.getCollectionById(Number(req.params.id));
        if (!collection) {
            return ApiResponse.error(res, 404, "Collection not found");
        }
        return ApiResponse.success(res, "Collection fetched successfully", collection);
    });
    // ==========================================================
    // Get Collection By Slug
    // ==========================================================
    static getCollectionBySlug = asyncHandler(async (req, res) => {
        const slug = req.params.slug;
        const collection = await CollectionService.getCollectionBySlug(slug);
        if (!collection) {
            return ApiResponse.error(res, 404, "Collection not found");
        }
        return ApiResponse.success(res, "Collection fetched successfully", collection);
    });
    // ==========================================================
    // Create Collection
    // ==========================================================
    static createCollection = asyncHandler(async (req, res) => {
        const id = await CollectionService.createCollection(req.body);
        return ApiResponse.success(res, "Collection created successfully", {
            id
        });
    });
    // ==========================================================
    // Update Collection
    // ==========================================================
    static updateCollection = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        await CollectionService.updateCollection(id, req.body);
        return ApiResponse.success(res, "Collection updated successfully");
    });
    // ==========================================================
    // Delete Collection
    // ==========================================================
    static deleteCollection = asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        await CollectionService.deleteCollection(id);
        return ApiResponse.success(res, "Collection deleted successfully");
    });
}
//# sourceMappingURL=collection.controller.js.map