/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const {Router} =  require('express');
const {check} = require('express-validator');

const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post(
    '/new',
    [
        check('name', 'El nombre es Obligatorio').not().isEmpty(),
        check('email', 'El email es Obligatorio').isEmail(),
        check('password', 'El password es Obligatorio y debe tener minimo 6 Caracteres').isLength({min: 6}),
        validarCampos
    ],
    crearUsuario
)

router.post(
    '/',
    [
        check('email', 'El email es Obligatorio').isEmail(),
        check('password', 'El password es Obligatorio y debe tener minimo 6 Caracteres').isLength({min: 6})
    ],
    loginUsuario
) 

router.get('/renew', validarJWT, revalidarToken)

module.exports = router; 