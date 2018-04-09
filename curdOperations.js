function curdOperations() {
  var stdFetch = {
    request: function(url, options) {
      if (options.dataType === "json") {
        return fetch(url, options).then(resp => resp.json());
      } else if (options.dataType === "blob") {
        return fetch(url, options).then(resp => resp.blob());
      } else if (options.dataType === "text") {
        return fetch(url, options).then(resp => resp.text());
      } else if (options.dataType === "formData") {
        return fetch(url, options).then(resp => resp.formData());
      }
    },

    //getting a resource
    get: function(url, options = { dataType: "json" }) {
      return this.request(url, options);
    },

    //posting a new resource
    post: function(url, options = { dataType: "json" }) {
      options.method = "POST";
      if (!options.dataType) {
        options.dataType = "json";
      }
      if (options.body) {
        options.body = JSON.stringify(options["body"]);
      }
      return this.request(url, options);
    },

    //updating a resource
    put: function(url, options = {}) {
      options.method = "PUT";
      if (!options.dataType) {
        options.dataType = "json";
      }
      if (options.body) {
        options.body = JSON.stringify(options["body"]);
      }
      return this.request(url, options);
    },

    patch: function(url, options = {}) {
      options.method = "PATCH";
      if (!options.dataType) {
        options.dataType = "json";
      }
      if (options.body) {
        options.body = JSON.stringify(options["body"]);
      }
      return this.request(url, options);
    },

    //deleting a resource
    delete: function(url, options = {}) {
      options.method = "DELETE";
      return fetch(url, options);
    }
  };

  // global.stdFetch = stdFetch;
  return stdFetch;
}

module.exports = curdOperations;
