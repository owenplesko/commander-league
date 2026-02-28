import { authGuard } from "../middleware/auth";
import { base } from "../orpc";

const createTrade = base.trade.list.use(authGuard);
