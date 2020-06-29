import moment from 'moment';
import Watched from '../schemas/Watched';

class WatchedController {
  async index(req, res) {
    const watched = await Watched.find({ userId: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(1);
    const watching = watched[0];

    if (watching) {
      const diffTime = moment.duration(
        moment().diff(moment(watching.createdAt))
      );

      if (diffTime < moment.duration(watching.duration)) {
        return res.json(watching);
      }
    }

    return res.json({});
  }
}

export default new WatchedController();
