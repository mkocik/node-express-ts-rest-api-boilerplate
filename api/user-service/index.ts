import service from './src/service'
import {config} from "dotenv";

config();
const PORT = process.env.PORT

service.express.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
