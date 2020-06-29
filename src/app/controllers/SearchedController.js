import Searched from '../schemas/Searched';

class SearchedController {
  async index(req, res) {
    const searched = await Searched.find({ userId: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(5);

    return res.json(searched);
  }
}

export default new SearchedController();
