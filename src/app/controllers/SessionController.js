import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../schemas/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: true, message: 'Validation fails.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const login = await bcrypt.compare(password, user.password);

    if (!login) {
      return res
        .status(400)
        .json({ error: true, message: 'Email or user invalid.' });
    }

    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found.' });
    }

    const id = user._id;

    return res.json({
      user,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
