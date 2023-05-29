import makeDbSetup from "./pouchConfig";
import makeDbQuery from "./db";
import makeController from "./controller";

const db = makeDbSetup();
const query = makeDbQuery({ db });
const controller = makeController({ db: query });

module.exports = {
    db,query,controller
}