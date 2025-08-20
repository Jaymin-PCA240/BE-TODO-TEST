import 'dotenv/config';
import { createServer } from './server';

const PORT = Number(process.env.PORT || 80);

const app = createServer();
app.listen(PORT, () => {
  console.log(`TODO API listening on http://localhost:${PORT}`);
});
