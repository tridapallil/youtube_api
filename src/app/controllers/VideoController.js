import moment from 'moment';
import api from '../services/api';
import Searched from '../schemas/Searched';
import Watched from '../schemas/Watched';
import Week from '../schemas/Week';

import WordsCount from '../lib/WordsCount';
import DaysCount from '../lib/DaysCount';

import redisClient from '../../config/redis';

class VideoController {
  async index(req, res) {
    const { search } = req.query;

    const watched = await Watched.find({ userId: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(1);
    const watching = watched[0];
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
    }

    if (search) {
      await Searched.create({ search, userId: req.userId });

      redisClient.get(search, async (err, reply) => {
        if (reply) {
          return res.json(JSON.parse(reply));
        }
        await Searched.create({ search, userId: req.userId });
        let pageToken = '';
        let commonWords = '';
        let totalTime = moment.duration('PT0M0S');
        const arrResponse = [];

        const week = await Week.findOne({ userId: req.userId });

        const maxTime = moment.duration(
          `PT${Math.max(
            week.sunday,
            week.monday,
            week.tuesday,
            week.wednesday,
            week.thursday,
            week.friday,
            week.saturday
          )}M0S`
        );
        while (arrResponse.length < 10) {
          let ids = '';
          // eslint-disable-next-line no-await-in-loop
          const response = await api
            .get(`search`, {
              params: {
                q: search,
                type: 'video',
                maxResults: 10,
                pageToken,
              },
            })
            .catch(error => {
              return res.json(error);
            });

          pageToken = response.data.nextPageToken;

          // take all id's
          // eslint-disable-next-line no-loop-func
          response.data.items.forEach(row => {
            ids += `id=${row.id.videoId}&`;
          });

          // eslint-disable-next-line no-await-in-loop
          const response2 = await api
            .get(`videos?${ids}`, {
              params: { part: 'contentDetails, snippet' },
            })
            .catch(error => {
              return res.json(error);
            });

          // sum total time duration
          // eslint-disable-next-line no-loop-func
          response2.data.items.forEach(row => {
            // get only first 200 videos and videos with time smaller than the max time that the user can watch in a week
            if (arrResponse.length < 200) {
              commonWords += ` ${row.snippet.title.toLowerCase()} ${row.snippet.description.toLowerCase()}`;
              totalTime = moment
                .duration(row.contentDetails.duration)
                .add(moment.duration(totalTime).minutes(), 'minutes')
                .add(moment.duration(totalTime).seconds(), 'seconds')
                .add(moment.duration(totalTime).hours(), 'hours');
              const longer =
                moment.duration(row.contentDetails.duration) > maxTime;
              arrResponse.push({
                id: row.id,
                duration: row.contentDetails.duration,
                title: row.snippet.title,
                description: row.snippet.description,
                thumb: row.snippet.thumbnails.medium.url,
                longer,
              });
            } else {
              return false;
            }
          });
        }

        const prov = WordsCount.topWords(commonWords);

        const totalDays = DaysCount.totalDays(week, arrResponse);

        const topWords = [];
        topWords.push(prov[0]);
        topWords.push(prov[1]);
        topWords.push(prov[2]);
        topWords.push(prov[3]);
        topWords.push(prov[4]);

        redisClient.set(
          search,
          JSON.stringify({
            topWords,
            totalDays,
            arrResponse,
          })
        );

        const date = new Date();

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

        // set a redis cache for a specific search, and set the expire value, the same value from day's minutes.
        redisClient.expire(search, (totalHours * 60 + totalMinutes) * 60);

        return res.json({
          topWords,
          totalDays,
          arrResponse,
        });
      });
    }
  }
}

export default new VideoController();
