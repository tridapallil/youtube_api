import * as Yup from 'yup';
import Week from '../schemas/Week';

class WeekController {
  async index(req, res) {
    const weeks = await Week.find({ userId: req.userId });

    return res.json(weeks);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      sunday: Yup.number().required(),
      monday: Yup.number().required(),
      tuesday: Yup.number().required(),
      wednesday: Yup.number().required(),
      thursday: Yup.number().required(),
      friday: Yup.number().required(),
      saturday: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: true, message: 'Validation fails.' });
    }

    const week = await Week.findOneAndUpdate({ userId: req.userId }, req.body);

    return res.json(week);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      sunday: Yup.number().required(),
      monday: Yup.number().required(),
      tuesday: Yup.number().required(),
      wednesday: Yup.number().required(),
      thursday: Yup.number().required(),
      friday: Yup.number().required(),
      saturday: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: true, message: 'Validation fails.' });
    }

    const weekExists = await Week.findOne({ userId: req.userId });

    if (weekExists) {
      return res.status(400).json({
        error: true,
        message: 'Week already registered for this user.',
      });
    }

    const {
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = req.body;

    const week = await Week.create({
      userId: req.userId,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });

    return res.json(week);
  }
}

export default new WeekController();
