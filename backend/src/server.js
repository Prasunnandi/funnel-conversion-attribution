import express from 'express';
import cors from 'cors';
import { funnelStages, attributionModels, dropOffRootCauses } from './data.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'funnel-conversion-attribution', timestamp: new Date().toISOString() });
});

app.get('/api/funnel', (req, res) => {
  res.json({
    stages: funnelStages,
    overallConversionRatePct: 3.88,
    totalVisitors: 125000,
    totalPaidCustomers: 4850
  });
});

app.get('/api/attribution', (req, res) => {
  res.json({
    channels: attributionModels,
    totalAttributedArrUsd: attributionModels.reduce((acc, c) => acc + c.attributedArrUsd, 0)
  });
});

app.get('/api/drop-offs', (req, res) => {
  res.json({
    dropOffs: dropOffRootCauses,
    totalDropOffs: dropOffRootCauses.reduce((acc, d) => acc + d.dropOffCount, 0)
  });
});

app.listen(PORT, () => {
  console.log(`Funnel Conversion & Attribution API running on port ${PORT}`);
});
