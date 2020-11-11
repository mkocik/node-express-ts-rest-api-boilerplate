import {Request, Response, Router} from 'express'
import {check} from "express-validator";
import {route} from "@api-template/api-service/src/api/route";
import {auth} from "../middlewares/auth.middleware";
import {UserController} from "./user.controller";
import {AuthController} from "./auth.controller";

const router: Router = Router()
const userController = new UserController();
const authController = new AuthController();

router.get('/', (req: Request, res: Response) => {res.status(200).send('Service is working correctly!')})

/**
 * @swagger
 * /:
 *   post:
 *     summary: Registers the user
 *     tags: [User]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       "201":
 *         description: User schema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/',
    [
        check('firstName', 'Field required').exists(),
        check('lastName', 'Field required').exists(),
        check('email', 'Field required').exists(),
        check('password', 'Field required').exists()
    ],
    route(userController.create))



/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs the user in
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                email:
 *                  type: string
 *              example:
 *                password: pass
 *                email: john.doe@example.it
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: object
 *                   properties:
 *                     expires:
 *                       type: number
 *                     token:
 *                       type: string
 *                 refreshToken:
 *                   type: object
 *                   properties:
 *                       expires:
 *                         type: number
 *                       token:
 *                         type: string
 */
router.post('/login', [
        check('email', 'Please pass a valid email').isEmail(),
        check('password', 'Field required').exists()
    ],
    route(authController.login))


/**
 * @swagger
 * /token:
 *   post:
 *     summary: Refreshes the access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *     responses:
 *       "200":
 *         description: An offer schema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: object
 *                   properties:
 *                     expires:
 *                       type: number
 *                     token:
 *                       type: string
 *                 refreshToken:
 *                   type: object
 *                   properties:
 *                       expires:
 *                         type: number
 *                       token:
 *                         type: string
 */
router.post('/token', [
        check('accessToken', 'Field required').exists(),
        check('refreshToken', 'Field required').exists()
    ],
    route(authController.refreshToken))

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Invalidates the refresh token for given user
 *     tags: [GenericAuth]
 *     responses:
 *       "204":
 *         description: User has been logged out
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout',
    route(auth(authController.logout)))


export default router
