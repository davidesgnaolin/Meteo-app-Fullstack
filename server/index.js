const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Funzione per trasformare i codici di Open-Meteo in testo
const interpretaCodice = (code) => {
    if (code === 0) return "Cielo Sereno";
    if (code <= 3) return "Parzialmente Nuvoloso";
    if (code >= 45 && code <= 48) return "Nebbia";
    if (code >= 51 && code <= 67) return "Pioggia";
    if (code >= 71 && code <= 77) return "Neve";
    if (code >= 80 && code <= 82) return "Rovesci di Pioggia";
    if (code >= 95) return "Temporale";
    return "Nuvoloso";
};

app.get('/api/meteo', async (req, res) => {
    const cittaUtente = req.query.citta || 'Milano';

    try {
        // 1. Geocoding: da nome a coordinate
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cittaUtente)}&count=1&language=it&format=json`;
        const geoRes = await axios.get(geoUrl);

        if (!geoRes.data.results || geoRes.data.results.length === 0) {
            return res.status(404).json({ error: "Città non trovata" });
        }

        const { latitude, longitude, name, country } = geoRes.data.results[0];

        // 2. Weather: recupero meteo reale
        const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const meteoRes = await axios.get(meteoUrl);
        const wc = meteoRes.data.current_weather.weathercode;

        res.json({
            citta: `${name}, ${country}`,
            temperatura: meteoRes.data.current_weather.temperature,
            condizione: interpretaCodice(wc),
            codiceMeteo: wc
        });

    } catch (error) {
        res.status(500).json({ error: "Errore caricamento dati" });
    }
});

app.listen(3000, () => console.log("Backend Meteo Real-Time pronto su porta 3000"));