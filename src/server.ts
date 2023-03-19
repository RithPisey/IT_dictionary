import { Application } from "./app";

const instantiate = new Application();

const port = process.env.PORT || 5000;

instantiate.app.listen(port, () => {
	console.log(`server run port ${port}`);
});
