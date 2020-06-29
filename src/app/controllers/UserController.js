import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import User from '../schemas/User';

class UserController {
  async index(req, res) {
    const user = await User.findById(req.userId);

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: true, message: 'Validation fails.' });
    }

    const user = await User.findOneAndUpdate({ _id: req.userId }, req.body);

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: true, message: 'Validation fails.' });
    }

    const password = await bcrypt.hash(req.body.password, 8);

    const { name, email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ error: true, message: 'User already exists.' });
    }

    const user = await User.create({ name, email, password });

    return res.json(user);
  }
}

export default new UserController();
