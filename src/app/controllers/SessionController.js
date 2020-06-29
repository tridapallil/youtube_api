import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Session from '../schemas/Session';
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

    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found.' });
    }

    const login = await bcrypt.compare(password, user.password);

    if (!login) {
      return res
        .status(400)
        .json({ error: true, message: 'Email or user invalid.' });
    }

    const date = new Date();

    const session = await Session.create({ userId: user.id });

    const id = user._id;

    const totalHours = moment
      .duration(
        moment(date)
          .endOf('day')
          .diff(moment())
      )
      .hours();
    const totalMinutes = moment
      .duration(
        moment(date)
          .endOf('day')
          .diff(moment())
      )
      .minutes();

    return res.json({
      user,
      session,
      sessionTime: `${totalHours * 60 + totalMinutes} minutes`,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: `${totalHours * 60 + totalMinutes} minutes`,
      }),
    });
  }
}

export default new SessionController();
