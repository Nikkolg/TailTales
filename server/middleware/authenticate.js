const jwt = require('jsonwebtoken');

const authenticateMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  try {
    console.log(`Получен токен ${token}`);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Верификация успешна');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Ошибка при верификации токена:', error);
    res.status(401).json({ message: 'Токен недействителен' });
  }
}

module.exports = authenticateMiddleware;
