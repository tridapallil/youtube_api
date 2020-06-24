import api from '../services/api';

class SessionController {
  async index(req, res) {
    const response = await api.get(`videos`).catch(error => {
      if (error) {
        return res.json(error);
      }
    });
    return res.json(response.data);
  }
}

export default new SessionController();
