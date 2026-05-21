import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);

/* Users / orders / analytics / audit — только админ. */
const adminOnly = requireRole('admin');
router.get('/users',          adminOnly, asyncHandler(adminController.listUsers));
router.get('/users/:id',      adminOnly, asyncHandler(adminController.getUser));
router.patch('/users/:id',    adminOnly, asyncHandler(adminController.updateUser));

router.get('/orders',         adminOnly, asyncHandler(adminController.listOrders));
router.patch('/orders/:id',   adminOnly, asyncHandler(adminController.updateOrder));

router.get('/analytics',      adminOnly, asyncHandler(adminController.analytics));

router.get('/audit',          adminOnly, asyncHandler(adminController.listAudit));

/* Контент — editor + admin. */
const contentAuthor = requireRole('editor', 'admin');
router.get('/posts',          contentAuthor, asyncHandler(adminController.listPosts));
router.get('/posts/:id',      contentAuthor, asyncHandler(adminController.getPost));
router.post('/posts',         contentAuthor, asyncHandler(adminController.createPost));
router.patch('/posts/:id',    contentAuthor, asyncHandler(adminController.updatePost));
router.delete('/posts/:id',   contentAuthor, asyncHandler(adminController.deletePost));

router.get('/categories',          contentAuthor, asyncHandler(adminController.listCategories));
router.post('/categories',         contentAuthor, asyncHandler(adminController.createCategory));
router.patch('/categories/:id',    contentAuthor, asyncHandler(adminController.updateCategory));
router.delete('/categories/:id',   contentAuthor, asyncHandler(adminController.deleteCategory));

export default router;
