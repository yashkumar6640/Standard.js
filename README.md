# Standard.js
A very efficient  Javascript Library


<h2>Application Structure:</h2><br>
<pre>
/app
    /components
              /home
                  /home.js
                  /home.html
                  /home.css
              /view
                  /view.js
                  /view.html
                  /view.css
/index.html
/main.js
</pre>

### Require the module:
##### inside main.js(entry js file):

<pre> var standard = require("stnd.js"); </pre>

##### Register the components:
<pre>
var view = require("./app/components/view/view.js");
var home = require("./app/components/home/home.js");
var mainContent = require("./main.html")
</pre>

##### Storing the component's data:

<pre>
std.storeComponent("main", {
  data: {},
  template: mainContent,
  events:[{
    target: '',
    onClick: function(){}
  }]
})
</pre>

##### Rendering the component on a target:

<pre>std.renderOnTarget("home", "#renderHere");</pre>

##### Data-flow between components:
<pre>
std.passData("view", {
  title: "Data coming from home component"
})
</pre>

##### Reset the component's data and automatic re-render:
<pre>set.setData("home",{num: 6});</pre>

##### Data-binding:

###### if home component has a data {name: "home component"},
###### then inside the html of home component use expression: {{name}}



## Basic example:
##### webpack.config.js
<pre>
const path = require("path");

module.exports = {
  entry: "./main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.html?$/,
        loader: "html-loader"
      }
    ]
  }
};
</pre>

##### index.html
  `<div id="root"></div>`

##### main.js
<pre>
require("stnd.js");

var home = require("./app/components/home/home.js");
var view = require("./app/components/view/view.js");

//bootstrap

std.renderOnTarget("home", "#root");
</pre>

##### home.js
<pre>
var homeTemplate = require("./home.html");

std.storeComponent("home", {
  data: { title: " Inside home Component" },
  template: homeTemplate,
  events: [
    {
      target: "#renderView",
      onClick: function() {
        std.renderOnTarget("view", "#root");
      }
    }
  ]
});

export default function home() {}

</pre>

##### home.html
`<h1>Home</h1>`
`<button id="renderView">Render view component</button>`
{{title}}

##### view.js
<pre>
var viewTemplate = require("./view.html");

std.storeComponent("view", {
  data: { title: "Inside View Component" },
  template: viewTemplate,
  events: [
    {
      target: "#renderHome",
      onClick: function() {
        std.renderOnTarget("home", "#root");
      }
    }
  ]
});

export default function view() {}
</pre>

##### view.html
`<h1>View</h1>`
`<button id="renderHome">Render Home Component on root</button>`
`{{title}}`

##### Run your index.html with live server to quickly test

License
----

MIT

