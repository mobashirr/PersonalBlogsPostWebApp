
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');


// create express app
const app = express();

app.use(express.json());

// import routes
const routerPages = require(path.join(__dirname, 'routes/index'));
const routerApiEndpoints = require(path.join(__dirname, 'routes/api'));
const port = 8000;

// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

// Set EJS as the view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/server/views'));
app.set('layout', path.join(process.cwd(), 'src/server/views/layouts/main')); // default layout file

// static content
app.use(express.static(path.join(__dirname, '../public')));

// Add routes to my app
app.use("/", routerPages);
app.use("/api/", routerApiEndpoints);



// start listining
app.listen(port, () => {
    console.log(`app started listining at ${port}`);
})