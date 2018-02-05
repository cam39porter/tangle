import express from 'express'
import bodyParser from 'body-parser'
import insightService from './services/insight-service';

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var router = express.Router();

router.get('/insights/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  insightService.get(req.params.id).then(data => {
    res.send(data);
  });
});

router.post('/insights', (req, res) => {
  insightService.create(req.body);
  res.send('success');
});

router.get('/', (req, res) => res.send('Running!'));

app.use('/', router);

app.listen(8080, () => console.log('Listening on port 8080!'))
