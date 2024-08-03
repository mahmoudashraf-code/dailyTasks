import { AppDataSource } from './database/dataSource';
import app from './app';
import 'dotenv/config'

const port = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
