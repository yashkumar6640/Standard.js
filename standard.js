//MIT License

// Copyright (c) 2018 Yash Kumar

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of std software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and std permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var crudOperations = require("./crudOperations.js");
global.stdFetch = crudOperations();

module.exports = (function() {
  var instance;
  var std = {
    components: {},
    templates: {},

    passData: function(component, data) {
      var comp_data = std.components[component].component_data.data;
      for (let i in data) {
        comp_data[i] = data[i];
      }
    },

    setData: function(component, data) {
      var comp_data = std.components[component].component_data;
      for (let i in data) {
        comp_data.data[i] = data[i];
      }
      var element = document.querySelector(comp_data.current_target);
      std.replaceData(element, component, data);
    },

    storeComponent: function(component, component_data) {
      std.components[component] = {
        componentName: component,
        component_data: component_data
      };
      if (component_data.events) {
        std.addEventsToComponent(component, component_data);
      }
    },

    renderOnTarget: function(component, target, data = {}) {
      if (typeof arguments[1] === "object") {
      }
      if (!std.components[component].component_data.data) {
        std.components[component].component_data.data = data;
      } else {
        for (key in data) {
          if (data.hasOwnProperty(key)) {
            std.components[component].component_data.data[key] = data[key];
          }
        }
      }
      var template = std.components[component].component_data.template;
      std.components[component].component_data.current_target = target;
      var element = document.querySelector(target);
      element.innerHTML = template;
      std.templates[component] = template;

      std.loadComponent(element, component);
    },

    addEventsToComponent: function(component, component_store_data) {
      component_store_data.events.forEach(event => {
        if (event.onClick) {
          var target_elements = document.querySelectorAll(event.target);
          target_elements.forEach(target_element => {
            target_element.addEventListener("click", event.onClick);
          });
        }

        if (event.onMouseOver) {
          var target_elements = document.querySelectorAll(event.target);
          target_elements.forEach(target_element => {
            target_element.addEventListener("mouseover", event.onMouseOver);
          });
        }

        if (event.onInput) {
          var target_elements = document.querySelectorAll(event.target);
          console.log(target_elements);
          target_elements.forEach(target_element => {
            target_element.addEventListener("input", event.onInput);
          });
        }

        if (event.onChange) {
          var target_elements = document.querySelectorAll(event.target);
          console.log(target_elements);
          target_elements.forEach(target_element => {
            target_element.addEventListener("change", event.onChange);
          });
        }
      });
    },

    renderTheDataIfIdPresent: function(element, data_ids, data, component) {
      console.log(std);
      for (var data_id in data_ids) {
        if (data_id in data) {
          var ele_to_be_changed = element.querySelectorAll(
            "[std-id-" + data_id + "]"
          );
          ele_to_be_changed.forEach(ele => {
            ele.innerText =
              std.components[component].component_data.data[data_id];
          });
        }
      }
    },

    replaceData: function(element, component, data) {
      var data_ids = std.components[component].observables;

      if (data) {
        std.renderTheDataIfIdPresent(element, data_ids, data, component);
      }

      if (element) {
        var component_store_data = std.components[component].component_data;
        var result;
        var myRe = /\{{(.*?)\}}/g;
        var str = element.innerHTML;
        var data_array = [];

        while ((data_array = myRe.exec(str)) != null) {
          var local_data_key = data_array[1];

          if (!std.components[component].observables) {
            std.components[component].observables = {};
          }

          std.components[component].observables[local_data_key] =
            "std-id-" + local_data_key;

          var data_to_be_replaced = std.components[component].component_data;
          component_store_data = data_to_be_replaced;

          if (data_to_be_replaced.data[local_data_key]) {
            str = str.replace(
              data_array[0],
              "<span std-id-" +
                data_array[1] +
                ">" +
                data_to_be_replaced.data[local_data_key] +
                "</span>"
            );

            element.innerHTML = str;
          } else if (
            Array.isArray(data_to_be_replaced.data[local_data_key]) === true
          ) {
          }
        }
      }
    },

    loadComponent: function(element, component) {
      if (element) {
        std.replaceData(element, component);
        var component_store_data = std.components[component].component_data;
        if (component_store_data.events) {
          std.addEventsToComponent(component, component_store_data);
        }
      }
    }
  };

  ["click", "change", "load", "mouseover", "input"].forEach(event => {
    document.addEventListener(event, function(e) {
      if (e.target && e.target.matches("[on-" + event + "]")) {
        let fn = e.target.getAttribute("on-" + event);
        let comp = e.target.dataset.component;
        std.components[comp].component_data[fn](e);
      }
    });
  });
  // global.std = std;

  return {
    storeComponent: std.storeComponent,
    setData: std.setData,
    passData: std.passData,
    renderOnTarget: std.renderOnTarget
  };
})();
