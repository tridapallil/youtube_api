import Watched from '../schemas/Watched';

class WatchedController {
  async index(req, res) {
    const { search } = req.query;
    if (search) {
      const watched = await Watched.find({ userId: req.userId, search }).sort({
        createdAt: 'desc',
      });

      return res.json(watched);
    }
    const watched = await Watched.find({ userId: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(4);

    return res.json(watched);
  }
}

export default new WatchedController();
