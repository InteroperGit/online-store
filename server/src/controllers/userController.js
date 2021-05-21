const ApiError = require('../errors/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/index');
const ControllerBase = require('./controllerBase');
const { getCurrentDateTime } = require('../libs/date');

const WRONG_EMAIL_OR_PASSWORD = 'Некорректный email или пароль';
const USER_ID_UNDEFINED = 'Не задан идентификатор пользователя';
const USER_IS_NOT_FOUND = 'Пользователь не найден';
const EMPTY_FULLNAME = 'Не заполнено поле ФИО';
const EMPTY_NICKNAME = 'Не заполнено поле Имя пользователя';
const USER_ALREADY_EXISTS = 'Указанный пользователь уже зарегистрирован';
const COMMON_ERROR = 'Внутренняя ошибка. Попробуйте еще раз или обратитесь к администратору';
const SALT_HASH_ROUND = 5;
const EMPTY_STRING = '';

const generateJWT = (id, email, role) => {
    const signOptions = { expiresIn: '24h' };
    const payload = { id, email, role };
    return jwt.sign(payload, process.env.SECRET_KEY, signOptions);
};

class UserController extends ControllerBase {
    async registration(req, res, next) {
        const blFunc = async () => {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return next(ApiError.internal(WRONG_EMAIL_OR_PASSWORD));
            }

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.internal(USER_ALREADY_EXISTS));
            }

            const hash = await bcrypt.hash(password, SALT_HASH_ROUND);
            const user = await User.create({ 
                email,
                password: hash,
                role
             });
             const basket = await Basket.create({ userId: user.id });

             const token = generateJWT(user.id, user.email, user.role);
             return res.json({ token });
        }

        this.modify(req, res, next, blFunc, 'UserController.registration');
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal(WRONG_EMAIL_OR_PASSWORD));
            }

            let comparedPassword = bcrypt.compareSync(password, user.password);

            if (!comparedPassword) {
                return next(ApiError.internal(WRONG_EMAIL_OR_PASSWORD))
            }

            const token = generateJWT(user.id, user.email, user.role);
            res.json({ token: token });
        } 
        catch (error) {
            console.log(`[${getCurrentDateTime()}] [UserController]. ${error}`);
            return next(ApiError.internal(COMMON_ERROR));
        }
    }

    async check(req, res) {
        try {
            const { id, email, role } = req.user;
            const token = generateJWT(id, email, role);
            return res.json({ token });
        } 
        catch (error) {
            console.log(`[UserController]. ${error}`);
            return next(ApiError.internal(COMMON_ERROR));
        }
    }

    async getAll(req, res, next) {
        const { filter, filterKey = 'fullName', orderKey = 'fullName', 
                orderDirection = 'ASC', limit = DEFAULT_LIMIT, page = INIT_PAGE } = req.query;
        const offset = page * limit - limit;
        let findOptions = { limit, offset };
        if (filter) {
            findOptions['where'][filterKey] = {
                [Op.like]: `%${filter}%`
            }
        }
        findOptions['order'] = [[orderKey, orderDirection]];

        try {
            const brands = await User.findAndCountAll(findOptions);
            return res.json(brands);
        } 
        catch (error) {
            console.error(`[DeviceBrandController] ${error}, ${error.stack}`);
            next(ApiError.internal(error.message));
        }
    }

    async create(req, res, next) {
        const blFunc = async () => {
            const { fullName, nickName, email, password, role='USER' } = req.body;
            if (!email || !password) {
                return next(ApiError.internal(WRONG_EMAIL_OR_PASSWORD));
            }

            if (!fullName) {
                return next(ApiError.internal(EMPTY_FULLNAME));
            }

            if (!nickName) {
                return next(ApiError.internal(EMPTY_NICKNAME));
            }
    
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.internal(USER_ALREADY_EXISTS));
            }

            const hash = await bcrypt.hash(password, SALT_HASH_ROUND);

            const user = await User.create({ 
                fullName,
                nickName,
                email,
                password: hash,
                role
             });
             const basket = await Basket.create({ userId: user.id });

             res.json(user);
        }

        this.modify(req, res, next, blFunc, 'UserController.create');
    }

    async update(req, res, next) {
        const blFunc = async () => {
            const { id, fullName, nickName, password } = req.body;
            
            if (!id) {
                return next(ApiError.internal(USER_ID_UNDEFINED));
            }
            
            if (!fullName || fullName === EMPTY_STRING) {
                return next(ApiError.internal(EMPTY_FULLNAME));
            }

            if (!nickName || nickName === EMPTY_STRING) {
                return next(ApiError.internal(EMPTY_NICKNAME));
            }

            let user = await User.findOne({ where: { id } });

            if (!user) {
                throw new DbError(USER_IS_NOT_FOUND);
            }

            const hash = await bcrypt.hash(password, SALT_HASH_ROUND);
            return await User.update({ fullName, nickName, password: hash }, { where: { id } });
        };

        const resultFunc = (result) => {
            return `${result} rows was updated`;
        }

        this.modify(req, res, next, blFunc, 'UserController.update', resultFunc);
    }

    async delete(req, res, next) {
        const blFunc = async () => {
            const { id } = req.body;

            if (!id) {
                return next(ApiError.internal(USER_ID_UNDEFINED));
            }

            const basketsDeleted = await Basket.destroy({ where: { userId: id } });

            
            if (basketsDeleted === 0) {
                throw new DbError(USER_ID_IS_NOT_FOUND);
            }

            const rowsCountDeleted = await User.destroy({ where: { id } });

            if (rowsCountDeleted === 0) {
                throw new DbError(USER_ID_IS_NOT_FOUND);
            }

            return rowsCountDeleted;
        }

        const resultFunc = (result) => {
            return `${result} rows was deleted`;
        }

        this.modify(req, res, next, blFunc, 'UserController.delete', resultFunc);
    }
}

module.exports = new UserController();