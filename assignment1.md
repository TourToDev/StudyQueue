# Creating a server-side API module using Express

### Overview

In Bootcamp# 1, we created a server to host our UF Directory App by implementing a primitive server-side router that responded to a single GET requests to '/footballClub' that retrieved our schools from a json file and sent the directory footballClub to the client’s browser.

In Bootcamp #2, we worked with MongoDB Atlas database to make our football club data persistent. We setup communication between database (MongoDB Atlas) and server (node.js) using Mongoose as our connection driver. We then created a database schema to organize the football clubs and we wrote a script `JSONtoMongo.js` to populate the database from the json file. We also created some test queries `queries.js` to ensure that our database worked.

In this Bootcamp #3, we will add more functionality to this server by integrating the CRUD functionality of Bootcamp #2 to create, read, update, and delete football clubs from a Mongo database as well as implement a server-side API that will allow us respond to http requests for creating, updating, and deleting the football clubs from the client/browser.

## Introduction to Express & Middleware

[**_Express_**](https://expressjs.com/) is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls. Middleware functions are functions that have access to the request object (req), the response object (res), and the next() middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.
- If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

An Express application can use the following types of middleware:

- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware

### How Middleware Works

Understanding the concept of **middleware** is extremely important in using Express effectively. Middleware are software architecture tools that allow you to invoke functions on a request before it reaches its final request handler. As a simple (yet quite useless) example, let's add a greeting to each request made to the server.

```javascript
/*app.use() Invokes this middleware function every time a request is 
received on any route for the express server */
app.use((req, res, next) => {
  req.greeting = "Hello there!";
  next();
});

//GET routing request handler
app.get("/", (req, res) => {
  res.send(req.greeting);
});
```

In addition to the usual request (req) and response (res) objects, we now pass an additional object called _next()_. Invoking _next()_ will pass the request on to whatever function is next in line to handle it. When there are a series of middleware function called one after the other it is considered a _middleware chain._ When the last one is called it sends the response back the the browser. You must call next() unless it is the last function in the chain, otherwise it will cause the browser to hang. Side Note: Passing functions and the results of those functions as parameters, is a common pattern in functional programming and cool feature of Javascript.

Now, let's consider a more useful scenario, say the application we are building has users with administrative privileges. There will be certain routes that we want to make sure the user has the correct privileges before allowing the request to be handled. Using Express, this becomes a relatively simple task:

```javascript
//CheckPermissions Middleware
const checkPermissions = (req, res, next) => {
  if (req.isAdmin === true) {
    next();
  } else {
    res.status(400).send("User does not have permission to access this path");
  }
};
/*GET request for route /privateData - before it can be accessed it must 
first pass the criteria in the checkPermission middleware function
*/
app.get("/privateData", checkPermissions, (req, res) => {
  res.send("Some really critical information");
});
```

The `checkPermissions` function serves as _middleware_ that is invoked before passing the request to its final destination. If the user has the right credential, it is granted access and the next() function is called and program control returned back to this request handler and proceeds on. If it doesn't then, it errors out and no permission is granted.

A final note: **order matters** when using middleware. If you place `app.use()` after a request handler, that middleware will not be invoked. Keep this in mind when developing your applications in case you encounter bugs.

If the concept of middleware is still confusing, you can read the [express documentation](https://expressjs.com/en/guide/using-middleware.html), an article on [writing middleware](https://expressjs.com/en/guide/writing-middleware.html), and these blog posts [post #1](https://medium.com/@agoiabeladeyemi/a-simple-explanation-of-express-middleware-c68ea839f498) and [post #2 ](https://medium.com/@jamischarles/what-is-middleware-a-simple-explanation-bb22d6b41d01)for further information.

### Server-Side Routing API

In this Bootcamp, we will build middleware in Express to help us with server-side routing and implement business logic on resources (e.g., footballClub) to curate the content we want to serve up to the client.

Let's start with the server-side routing. Since we are looking to expand the functionality of our server from Bootcamp #1 to handle additional requests, we could handle them in the same fashion as the original request handler, but it would quickly become unwieldy because there would need to be a bunch of conditional statements to handle requests to the different URL paths and different HTTP methods (such as POST, PUT, and DELETE). Luckily, the [**Express**](https://expressjs.com/en/5x/api.html#express.router) library makes this task much simpler by providing a layer of abstraction for handling HTTP requests in a Node server.

To provide an example, here is the request handler we wrote in Bootcamp 1:

```javascript
const requestHandler = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === "GET") {
    switch (parsedUrl.pathname) {
      case "/":
        //set response status code and content type
        response.writeHead(200, { "Content-Type": "text/html" });
        // set response content
        response.write("<html><body><h1>Homepage</h1></body></html>");
        response.write(
          "<html><body><p>Welcome to Football Club App</p></body></html>"
        );
        return response.end();
      case "/footballClub":
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(footballClub));
        return response.end();
      default:
        response.writeHead(404, { "Content-Type": "text/html" });
        // set response content
        response.write("<html><body><h1>Bad gateway error</h1></body></html>");
        return response.end();
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    // set response content
    response.write("<html><body><h1>Bad gateway error</h1></body></html>");
    response.end();
  }
};
```

Now here is the same request handler written using Express:

```javascript
app.get("/footballClub", (req, res) => {
  res.send(footballClub);
});

app.all("/*", (req, res) => {
  res.status(404).send("Bad gateway error");
});
```

Looking for information on using Express as router middleware take a look at the [documentation](https://expressjs.com/en/guide/using-middleware.html#middleware.router). Also take a look at the documentation on [request](https://expressjs.com/en/4x/api.html#req) and [response](https://expressjs.com/en/4x/api.html#res) objects.

### Server-side Controllers

Express can also be used to create server-side controllers that contain the business logic for processing a resource. The controller will contain methods for handling all the [CRUD operations](https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications). In your application, you many have multiple controllers that perform different functions on different resources. In this bootcamp, we have one controller that would help us to manage the footballClub data. Check out this [tutorial](https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/) with code example to help you get started on developing the `footballClubController.js` file for this bootcamp.

This is an example update function for a contact controller from a [CRUD API tutorial](https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d)

```Javascript
export default update = function (req, res) {

//identify the contact to be updated
Contact.findById(req.params.contact_id, function (err, contact) {

//Check for an error
        if (err)
            res.send(err);

//Update the contact information
        contact.name = req.body.name;
        contact.gender = req.body.gender;
        contact.email = req.body.email;
        contact.phone = req.body.phone;

// save the contact and check for errors
        contact.save(function (err) {
            if (err)
                  res.status(400).send(err);
            res.json({
                message: 'Contact Info updated',
                data: contact
            });
        });
    });
};
```

When using `import` instead of `require`, use `export default <variable>` instead of `module.exports =`. The `export` keyword will expose the variable to be imported in other modules. You can use the `default` keyword to let the importer import that variable without specifying exactly which one. To learn more about `export`, named export, and default export, visit these links:
https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export
https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910

In Bootcamp #2, `export` is used to create a custom object in the `footballClubModel.js` file, exporting it as `FootballClub` at the end of the file. In Bootcamp #3, this file is `footballClubModel.js`.

```javascript
/* Import mongoose and define any variables needed to create the schema */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const footballClubSchema = new Schema({
  /* your code for the your schema footballClub */
});

/* Use your schema to instantiate a Mongoose model */
const FootballClub = mongoose.model("footballClubs", footballClubSchema);

/* Export the model to make it available to other parts of your Node application */
export default FootballClub;
```

In Bootcamp #3, export is used to implement a set of functions in `footballClubController.js`.

```javascript
import mongoose from "mongoose";
import FootballClub from "../models/footballClubModel.js";

/* Show the current football club */
export const read = (req, res) => {
  /* send back the football club data as json from the request */
};

/* Update a football club - Complete the three tasks*/
export const update = (req, res) => {
  let footballClub = req.body;

  /* (1) Replace the article's properties with the new properties found in req.body 
    (2) Save the article 
    */
};
```

**Now the questions is how do you use these modules?**
You **Import modules** at the top of the files in which you want to use them. Notice at the top of this file, `footballClubController.js` we have imported the FootballClub model as a variable `import FootballClub from '../models/footballClubModel.js';`

This provides the controller the access to the football club model. Using `import *` means you are importing all named exports. `as` lets you assign these imported variables a name. `from` specifies what package or file to import from (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

### API Testing with Postman

[Postman](https://www.getpostman.com/product/api-client) is an API Development and Testing Environment. It has many cool features and support for developers who are creating backend APIs. We will be using Postman's features for sending HTTP requests and viewing HTTP responses by creating and testing REST queries.

For this assignment, it may be useful to use Postman to check that you are formatting your routes appropriately before putting them in your code. It is also useful when you don't have a front-end hooked up to your backend so that you can test that your code works. **Check out this [postman tutorial](https://www.guru99.com/postman-tutorial.html)** for a walk through of the tool and its features. It is a great tool to have in your pocket and well worth the time investment.

# _Assignment Details_

Now go ahead and fork this assignment's repository. You'll notice that the file structure of the application is now more involved than previous assignments. Browse around and take note of where each part of the application exists.

Navigate to `server/server.js`. This is where you will place code to configure your Express application. The **morgan** module is used to log requests to the console for debugging purposes. The **body parser** module is middleware that will allow you to access any data sent in requests as `req.body`.

In `server/routes/footballClubRouter.js`, you will find code that specifies the request handlers for CRUD tasks. To learn more about the Express router, [go to this page](http://expressjs.com/en/guide/routing.html) and scroll down to the section on _express.Router._

### Part 1 - Submit PDF in Canvas to Bootcamp #3

Create a diagram of how the different parts of the server interact with one another and add descriptive text as needed to demonstrate your understanding of the functionality of each file and their relationships to each other. Specifically make note of:

- the relationship between server.js and the router file. With your starting point in the application being `server.js`
  - how the router makes use of the controllers and model to determine the flow of request handling. Trace through each routes in `footballClubRouter.js` as the basis of your diagram. Consider making a sequence diagram (http://www.agilemodeling.com/artifacts/sequenceDiagram.htm) to help you communicate the flow of calls and data.
- the content defined in each controller and their roles in the application
  - how middleware is used throughout the application to modularize the code (e.g., (application-level, routing, controller, etc)
- the relationship between the test files and the missing functionality of the files you will need to update. What do they tell you need to do?

### Part 2 - Submit in GitHub

You should test your routes as you progress in the lab. Use mongo console to check the database, postman to check the routes, and logging to watch the internals of your code.

#### To Do List

> Before starting, make sure you ALWAYS installed your dependencies. This means simply run `npm i` the very first time you open it or anytime you add new dependencies to your project. In this case we use one dependency from the command line and need to install them globally. To do this run `npm install jest -g`.

1. Create a new folder in `server/` called `config`. Inside this new folder create a file called `config.js` paste this in it:

```js
export default {
  db: {
    uri:
      "", //place the URI of your mongo database here.
  },
  port: 5000,
};
```

- Add in your MongoDB Atlas URI (or localhost if you prefer this)

##### YOU MUST USE THE CONFIG.JS, DO NOT HARD-CODE YOUR URI OR API KEY ANYWHERE. YOU MUST PLACE EACH VALUE SOLELY IN THE CONFIG.JS -- NO EXCEPTIONS

2. Drop your database from Lab2 and re-populate it, so you can start clean. To do this, run `node JSONtoMongo.js` from your server directory.

3. Check the app configuration in `server.js` 

- It should serve the static files found in the `client` folder when a user makes a request to the path `/`. [Refer to this documentation](http://expressjs.com/en/starter/static-files.html) for help.
- It should use the footballClub router for requests going to the `/api/footballClubs` path.
- Last it should direct users to the client side `index.html` file for requests to any other path
- now run `npm start` (note that this is now using nodemon instead of node to run your server. This package allows the server to refresh whenever changes to the file are made) to see how our server is working and navigate to `http://localhost:5000` in the browser. Try some of the routes and see what happens. Right now, we only serve up index.html and the server hangs for all the other routes in our server.js file

  **TODO: It should also use labRouter for requests going to the `/api/lab3/` path.**

4. Familiarize yourself with the request handlers `read`, `create`, `update`, `remove`, and `getAllFootballClubs` in `footballClubController.js`. **TODO: Using these as an example, add two new functions `deleteByConference` and `getByMascot`**.

   - **implement functionality** `deleteByConference` and `getByMascot` in `footballClubController.js` see notes, code, and tutorials identified earlier in this README file for help.
     **You may want to use [postman](https://www.getpostman.com/downloads/) to develop and manually test your update, delete, list routes** (_Note:_ You will have to start your server to use Postman run `nodemon server/server`. )
     
     (i) The following should GET all footballClubs by Mascot, copy and paste a single entry "mascot" from your database to replace the <MASCOT> tag `http://localhost:5000/api/lab3/<MASCOT>`.
     
     (ii) Similarly, the following should DELETE all the football clubs from a particular conference - `http://localhost:5000/api/lab3/<CONFERENCE>`
     
     (iii) Try also to test the provided requests for further guidance.

5. Create a `labRouter.js` file inside of your `routes` directory, using `footballClubRouter.js` as an example. 
  
  **TODO: In `labRouter.js`, write the method calls that are responsible for routing requests to the correct request handler for the two added functions in the controller**

6. Make sure your server is functioning correctly by starting it up by running the command `nodemon server/server.` Manually **browser test your routes** try adding a test to create or update a footballClub and check the database to see if it is there. You may manually have to deleted the footballClub once you add it, unless you add a test to delete it.

## General Bootcamp Checklist

1. Make your changes to the bootcamp
  - Edit footballClubController.js and add the implementation for deleteByConference and getByMascot.
  - Edit server.js to include a request handler for /api/lab3/
  - Create a labRouter.js to include the method calls responsible for routing requests for the two new functions in the controller.
  - Using Postman, test GET `http://localhost:5000/api/lab3/<MASCOT>` and DELETE `http://localhost:5000/api/lab3/<CONFERENCE>` to check that your kab is behaving as expected.
2. Add your new files (if any) with: git add
3. Commit your changes with: git commit -m “this is what I did”
4. Upload your changes to github with: git push
5. Verify that you did things correctly by cloning your own project and testing it with: git clone

## Grading (25 points)

  - Completion (20 points)
  - Diagram (5 points)
