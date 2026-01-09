import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

/* =============================
   __dirname
============================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =============================
   STATIC FILES (BOOTSTRAP)
============================= */
app.use(
  '/bootstrap',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
);

/* =============================
   VIEW ENGINE
============================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =============================
   ROUTES
============================= */

// Home
app.get('/', (req, res) => {
  res.redirect('/program-kerja');
});

// Daftar program kerja
app.get('/program-kerja', async (req, res) => {
  try {
    const response = await axios.get(
      'http://localhost:1337/api/program-kerjas',
      {
        params: {
          populate: '*'
        }
      }
    );

    res.render('program-kerja', {
      prokers: response.data.data
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Terjadi kesalahan server');
  }
});

app.get('/program-kerja/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await axios.get(
      'http://localhost:1337/api/program-kerjas',
      {
        params: {
          populate: '*',
          filters: {
            slug: {
              $eq: slug
            }
          }
        }
      }
    );

    const proker = response.data.data[0];

    if (!proker) {
      return res.status(404).send('Program Kerja tidak ditemukan');
    }

    res.render('proker-detail', { proker,
        STRAPI_URL: "http://localhost:1337"
     });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Terjadi kesalahan server');
  }
});


/* =============================
   SERVER
============================= */
app.listen(3000, () => {
  console.log('Server Start on http://localhost:3000');
});
