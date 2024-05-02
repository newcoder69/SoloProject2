import express from 'express';

import * as blogController from '../controllers/blogController.js';

const router = express.Router();

router.get('/',blogController.getAllBlogs);

router.get('/:id',blogController.getBlogByID);

router.post('/',blogController.createBlogPost);

router.post('/like/:id', blogController.likeBlogPost);

router.post('/:id/comment/like/:commentIndex',blogController.likeBlogComment);

router.post('/:id/comment',blogController.createBlogComment);

router.delete('/:id',blogController.deleteBlogPost);

export default router;