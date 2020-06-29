import moment from 'moment';

import api from '../services/api';
import Week from '../schemas/Week';
import Watched from '../schemas/Watched';
import Session from '../schemas/Session';

import redisClient from '../../config/redis';

class WatchController {
  async index(req, res) {
    const { search } = req.query;

    const watchingList = await Watched.find({ userId: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(1);
    const watching = watchingList[0];
    if (watching) {
      const diffTime = moment.duration(
        moment().diff(moment(watching.createdAt))
      );

      if (
        diffTime < moment.duration(watching.duration) &&
        watching.search !== search
      ) {
        return res.status(400).json({
          error: true,
          message: `Você já está assistindo um vídeo da pesquisa ${watching.search}`,
        });
      }
      if (
        diffTime < moment.duration(watching.duration) &&
        watching.search === search
      ) {
        return res.json(watching);
      }
    }

    let nextVideo = '';
    let ended = true;
    let hasTime = true;

    redisClient.get(search, async (err, reply) => {
      const videos = JSON.parse(reply);

      const week = await Week.findOne({ userId: req.userId });
      const date = new Date();
      const startOfDay = moment().startOf('day');

      const watched = await Watched.find({ userId: req.userId, search });
      const session = await Session.findOne({
        userId: req.userId,
        createdAt: {
          $gte: startOfDay.toDate(),
          $lte: moment(startOfDay)
            .endOf('day')
            .toDate(),
        },
      }).sort({ createdAt: 'asc' });

      const sessionTime = moment.duration(
        moment().diff(moment(session.createdAt))
      );

      const dayDuration = moment.duration(
        `PT${
          week[
            moment(date)
              .format('dddd')
              .toLowerCase()
          ]
        }M0S`
      );

      if (sessionTime > dayDuration) {
        return res.status(400).json({
          error: true,
          message: 'You exceed your daily time to watch videos.',
        });
      }

      const remainingTime = moment
        .duration(dayDuration)
        .subtract(moment.duration(sessionTime).seconds(), 'seconds')
        .subtract(moment.duration(sessionTime).minutes(), 'minutes')
        .subtract(moment.duration(sessionTime).hours(), 'hours');

      const watchedList = watched.map(row => {
        return row.videoId;
      });

      videos.arrResponse.forEach(row => {
        if (watchedList.indexOf(row.id) > -1 || row.longer) {
          return true;
        }

        if (remainingTime < moment.duration(row.duration)) {
          hasTime = false;

          return false;
        }

        if (!nextVideo) {
          nextVideo = row.id;
          ended = false;
        }

        return false;
      });

      if (!hasTime) {
        return res.status(400).json({
          error: true,
          message: 'There is no more videos to watch today.',
        });
      }

      if (ended) {
        return res.status(400).json({
          error: true,
          message: 'You watched all the videos.',
        });
      }

      const response = await api.get(`videos`, {
        params: { part: 'contentDetails, snippet', id: nextVideo },
      });

      const responseData = response.data.items[0];

      await Watched.create({
        userId: req.userId,
        search,
        videoId: responseData.id,
        title: responseData.snippet.title,
        description: responseData.snippet.title,
        thumb: responseData.snippet.thumbnails.medium.url,
        duration: responseData.contentDetails.duration,
      });

      return res.json({
        userId: req.userId,
        search,
        videoId: responseData.id,
        title: responseData.snippet.title,
        thumb: responseData.snippet.thumbnails.medium.url,
        duration: responseData.contentDetails.duration,
        description: responseData.snippet.description,
      });
    });
  }
}

export default new WatchController();
