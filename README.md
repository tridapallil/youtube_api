# About
This project would build to consume the Youtube api, and to be consumed with some rules.
Search and shows YouTube videos for a search term;
● Shows the five most used words in titles and descriptions of the result;
● Shows how many days are needed to watch all the vídeos returned, with the following
conditions:
○ The user will input how much time he can expend daily during a week. For
example, [15, 120, 30, 150, 20, 40, 90] in minutes.
○ The user will not expend more time watching videos than his daily max.
○ The user will not start another video unless he can finish on the same day.
○ Videos longer than the longest day will be ignored.
○ The user will watch the videos in the exact order as returned.
○ Example: considering the week as stated above and the search returning 10
videos with the following durations: [20, 30, 60, 90, 200, 30, 40, 20, 60, 15], on
the first day no video will be watched, on the second the user will watch 3 videos
[20, 30, 60], on the third none will be watched, on the fourth 2 [90, 30] will be
watched and one will be ignored, on the fifth none will be watched, on the sixth
day one video [40] will be watched, on the seventh day 2 will be watched [20, 60]
and on the eighth day the last one will be watched [15].
○ Only the first 200 videos must be considered.


# Techs and Frameworks
- **[Express](https://www.npmjs.com/package/express "express")** -> Used to make the server (Simple and high performance server).

- **[Moment](https://www.npmjs.com/package/moment "moment")** -> A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.

- **[Docker]https://www.docker.com "docker")** -> Used to made database containers (Mongo and Redis).

- **[Redis]https://www.npmjs.com/package/redis "redis")** -> Cached database.

- **[Mongo]https://www.mongodb.com "mongo")** -> Main database.

- **[Mongoose]https://mongoosejs.com "mongoose")** -> Used to consume mongo.

- **[Axios](https://www.npmjs.com/package/axios "axios")** -> Used to do requests.

- **[EsLint](https://www.npmjs.com/package/eslint)** -> Used to make the code clean and standardized.

- **[Cors](https://www.npmjs.com/package/cors)** -> Used to make as middleware.

## How to run

***Clone the project

***Create .env file and put all the global variables values

```
yarn install
```
With docker installed, create and start a docker server, to mongo and redis
```
docker run --name mongoserver -p 27017:27017 -d -t mongo
```
```
docker run --name redisserver -p 6379:6379 -d -t redis:alpine
```
Then you can start your api
```
yarn dev
```
***The project will be running on http://localhost:3333


### Considerations
For next features, i would implement tests and made all the project run with docker.
