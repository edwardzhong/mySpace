### run project

```
npm run build
//build the front-end

npm start
// run the project with normal mode

npm run dev
// run the project with debug mode (node --harmony --inspect app)
```
### Personal blog(mySpace)
it's a full stack project

#### directory structure

common: common file folder
 - config: project config file
 - app.js: application config
 - db.js: database config
 - log4js.js: logger config  

controllers: sever-side controller folder
 
daos: database access layler folder
dist_views: production html page folder
logs: log files folder
node_modules: npm library
views:  develop html page folder
public: front-end static folder

 - admin: Administration folder (react)
    - actions
    - component
    - constants
    - containers
    - reducers
    - sagas
    - index.js: react entry
    - util.js: utility

 - css: css files
 - dist: front-end production folder
 - img: image file
 - js: client side js files
 - less: less file
 - lib: front-end library
 - rev:  generate by gulp-rev

routers.js: router
app.js: project entry
gulpfile.js: gulp config
package.json: project description 

#### server-side
1. node v7.5.0
2. web framework: koa2, use async/await to deal the callback
3. database: mysql v5.6.22
4. server-side template engine: swig
5. logger: log4.js
6. Timing components: schedule.js

#### front-end
1. jquery
2. mobile compatible
3. pre compile: less
4. icons: font-awesome 4.7.0
5. text editor: simplemde,base on codeMirror, markdown
6. react, redux, react-redux, react-router, redux-saga

#### client pages
1. home／article list: /page/:index
2. tag: /tag/:id:/:index
3. article detail: /article/:id
4. login/register: /sign
5. manage: /writer
6. data base tool: /tool

#### Administration page
1. webapp single page, base on react
2. download/upload/save/update/create/delete
