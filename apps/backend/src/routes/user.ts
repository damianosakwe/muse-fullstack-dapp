import { Router } from "express";
import {
  getProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  updatePreferences,
  getUserActivity,
  getUserStats,
  searchUsers,
  getLeaderboard,
} from "@/controllers/userController";
import {
  authenticate,
  optionalAuthenticate,
} from "@/middleware/authMiddleware";
import { standardLimiter } from "@/middleware/rateLimitMiddleware";

const router = Router();

/**
 * @openapi
 * /api/user/{address}:
 *   get:
 *     summary: Get user profile by address
 *     description: Retrieve public profile information for a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User's Stellar wallet address
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:address", optionalAuthenticate, getProfile);

/**
 * @openapi
 * /api/user/id/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     description: Retrieve public profile information for a user by their database ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User's database ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/id/:id", getProfileById);

/**
 * @openapi
 * /api/user/{address}:
 *   put:
 *     summary: Update user profile
 *     description: Update profile information (requires authentication, owner only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *               website:
 *                 type: string
 *               twitter:
 *                 type: string
 *               discord:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden - can only update own profile
 *       404:
 *         description: User not found
 */
router.put("/:address", authenticate, standardLimiter, updateProfile);

/**
 * @openapi
 * /api/user/{address}:
 *   delete:
 *     summary: Delete user profile
 *     description: Delete user account (requires authentication, owner only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete("/:address", authenticate, deleteProfile);

/**
 * @openapi
 * /api/user/{address}/preferences:
 *   put:
 *     summary: Update user preferences
 *     description: Update notification and privacy preferences (requires authentication)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   push:
 *                     type: boolean
 *               privacy:
 *                 type: object
 *                 properties:
 *                   profileVisibility:
 *                     type: string
 *                     enum: [public, private]
 *                   showEmail:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put("/:address/preferences", authenticate, updatePreferences);

/**
 * @openapi
 * /api/user/{address}/activity:
 *   get:
 *     summary: Get user activity
 *     description: Retrieve user's created items, collected items, and transaction history
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Activity retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:address/activity", getUserActivity);

/**
 * @openapi
 * /api/user/{address}/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve user's creation, collection, and transaction statistics
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:address/stats", getUserStats);

/**
 * @openapi
 * /api/user/search:
 *   get:
 *     summary: Search users
 *     description: Search for users by username, address, or bio
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search/query", searchUsers);

/**
 * @openapi
 * /api/user/leaderboard:
 *   get:
 *     summary: Get user leaderboard
 *     description: Retrieve top users by followers, creations, or collections
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [followers, created, collected]
 *           default: followers
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 */
router.get("/leaderboard/list", getLeaderboard);

export default router;
