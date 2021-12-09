/**
 * * Import app and listen on PORT 4000
 */

const app = require("./app");
const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server is listing on Port: ${PORT}`));
