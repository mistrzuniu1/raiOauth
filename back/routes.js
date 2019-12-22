/**
 * @swagger
 *
 * /users/login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required: true
 *         description: login credentials
 *         schema:
 *             type: object
 *             required:
 *               -  email
 *             properties:
 *                 email:
 *                     type: string
 *                 password:
 *                     type: string
 *     responses:
 *       200:
 *         description: login
 */
