"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const instantiate = new app_1.Application();
const port = process.env.PORT || 3000;
instantiate.app.listen(port, () => {
    console.log(`server run port ${port}`);
});
//# sourceMappingURL=server.js.map