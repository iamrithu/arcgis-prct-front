//-------------------------------
var demList = ["js", "pyt", "c+", "java", "c#"];
var container = document.getElementById("container");

container.innerHTML =
  `<div class="input-box-wrapper">
<div class="box">
  <input type="checkbox" value="" class="selectAll" id="selectAll" />
  <label for="selectAll">select-All</label>
</div>` +
  demList
    .map((e) => {
      return `<div class="box">
  <input
    type="checkbox"
    value="${e}"
    class="checkbox"
    id="javaScript"
  />
  <label for="javaScript">${e}</label>
</div>`;
    })
    .join("") +
  `</div>
<div class="print-values">
<p id="valueList"></p>
</div>`;

//-------------------------------

var valueList = document.getElementById("valueList");
var text = `<span> you have selected:</span>`;
var listArray = [];
var clicks = 0;
var checkboxes = document.querySelectorAll(".checkbox");
var selectAll = document.querySelector(".selectAll");

selectAll.addEventListener("change", function () {
  clicks = checkboxes.length;

  if (this.checked === true) {
    checkboxes.forEach((box) => {
      box.checked = true;
      listArray = listArray.filter((e) => e != box.value);
      listArray.push(box.value);
      valueList.innerHTML = text + listArray.join("/");
      console.log(listArray);
    });
  } else {
    clicks = 0;
    checkboxes.forEach((box) => {
      box.checked = false;
      listArray = listArray.filter((e) => e != box.value);
      valueList.innerHTML = text + listArray.join("/");
      console.log(listArray);
    });
  }
});

for (var checkbox of checkboxes) {
  checkbox.addEventListener("change", function () {
    if (this.checked == true) {
      clicks += 1;

      listArray.push(this.value);
      valueList.innerHTML = text + listArray.join("/");

      if (clicks === checkboxes.length) {
        selectAll.checked = true;
      }
    } else {
      clicks -= 1;

      selectAll.checked = false;
      listArray = listArray.filter((e) => e != this.value);
      valueList.innerHTML = text + listArray.join("/");
    }
  });
}
//------------------------------------------------

var Data = {
  type: "FeatureCollection",
  features: [],
};
var project = JSON.parse(localStorage.getItem("map"));
if (project === null) {
  window.close("./index.html");
}
var state = project[0].state;
var xy = state[0].split(",");
var x = parseFloat(xy[0]);
var y = parseFloat(xy[1]);

var bmap = project[0].baseMap;
var projectId = project[0]._id;
var userId = project[0].userId;
var projectName = project[0].projectName;

function reload() {
  document.getElementById("cog2").style.transform = "rotate(270deg)";
  document.getElementById("cog2").style.transition = "0.5s";
  location.reload();
}
function importData(x) {
  axios
    .get("http://localhost:8080/api/geolocation/project/" + x)
    .then((res) => {
      document.getElementById("dataImport").innerHTML = res.data
        .map((info) => {
          return `  <button class="expt"  value="${info._id}"onclick="imptDATA(this.value)">${info.layerName}</button>
      `;
        })
        .join(" ");
    });
}
importData(project[0]._id);
function back() {
  document.getElementById("cog").style.transform = "rotate(0deg)";
  document.getElementById("cog").style.color = "  #919189";
  document.getElementById("tab1").style.top = "-10%";
  document.getElementById("tab2").style.top = "-10%";
  document.getElementById("tab3").style.top = "-10%";
  document.getElementById("tab4").style.top = "-10%";
  value = false;
}

function cross() {
  document.getElementById("export").style.display = "none";
  document.getElementById("cross").style.display = "none";
}
function file() {
  document.getElementById("export").style.display = "block";
  document.getElementById("cross").style.display = "flex";
}
function expt() {
  if (Data.features.length > 0) {
    var name = prompt("Enter The Name");

    if (name) {
      fetch("http://localhost:8080/api/geolocation", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          layerName: name,
          user_id: userId,
          project_name: projectName,
          data: [Data],
        }),
      })
        .then(function (res) {
          importData(project[0]._id);
        })
        .catch(function (res) {
          console.log(res);
        });
    } else {
      alert("Give any name for the layer");
    }
  } else {
    alert("Draw a location ");
  }
}

function one() {
  if (Data.features.length > 0) {
    if (confirm("Are you sure to export this file") === true) {
      var obj = prompt("File Name");
      if (obj != null && obj != "") {
        let dataStr = JSON.stringify(Data);
        let dataUri =
          "data:application/geo+json;charset=utf-8," +
          encodeURIComponent(dataStr);
        let exportFileDefaultName = `${obj}.geojson`;
        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
      } else {
        alert("File name is  required");
      }
    } else {
      alert("Thank you");
    }
  } else {
    alert("There is no location");
  }
}
console.log(project[0].baseMap);
project.map((info) => {
  return console.log(info.baseMap);
});

document.getElementById("file").addEventListener("change", function () {
  var GetFile = new FileReader();

  GetFile.onload = function () {
    // DO Somthing
    var layers = JSON.parse(GetFile.result);
    console.log(layers);

    require([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/layers/FeatureLayer",
      "esri/widgets/LayerList",
      "esri/widgets/BasemapGallery",
      "esri/widgets/ScaleBar",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/support/SnappingControls",
      "esri/widgets/Search",
      "esri/widgets/Locate",
      "esri/widgets/Track",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils",
      "esri/widgets/CoordinateConversion",
      "esri/geometry/geometryEngine",
      "esri/widgets/Print",
    ], (
      esriConfig,
      Map,
      MapView,
      Graphic,
      GraphicsLayer,
      FeatureLayer,
      LayerList,
      BasemapGallery,
      ScaleBar,
      SketchViewModel,
      SnappingControls,
      Search,
      Locate,
      Track,
      Expand,
      webMercatorUtils,
      CoordinateConversion,
      geometryEngine,
      Print
    ) => {
      esriConfig.apiKey =
        "AAPK98c50a3510cc4cb9a07dc3116113843cqZssDSqHkgmBfOp_v5GIAETd4ggp7oleJJQPSyr9NmmTf-2GSs7swp9zS6T42ny7";
      const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });

      const map = new Map({
        basemap: bmap,
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 10,
        center: [x, y],
      });

      const scalebar = new ScaleBar({
        view: view,
        unit: "metric",
      });

      view.ui.add(scalebar, "bottom-right");

      const measurements = document.getElementById("measurements");
      view.ui.add(measurements, "manual");

      const basemapGallery = new BasemapGallery({
        view: view,
        container: document.getElementById("map"),
        source: {
          query: {
            title: '"World Basemaps for Developers" AND owner:esri',
          },
        },
      });
      const search = new Search({
        //Add Search widget
        view: view,
      });
      const track = new Track({
        view: view,
        graphic: new Graphic({
          symbol: {
            type: "simple-marker",
            size: "12px",
            color: "red",
            outline: {
              color: "#efefef",
              width: "1.5px",
            },
          },
        }),
        useHeadingEnabled: false,
      });

      view.ui.add(search, "top-left");
      view.ui.add(track, "top-left");
      // console.log(layer);
      layers.features.map((e) => {
        if (e.geometry.type === "Polygon") {
          var geometry_value = e.geometry.coordinates;
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: geometry_value.map((info) => {
                return info.map((e) => {
                  return e;
                });
              }),
            },
            properties: {},
          });
          // console.log(
          //   geometry_value[0].map((e) => {
          //     return e;
          //   })
          // );
          const polygon = {
            type: "polygon",
            // spatialReference: {
            //   wkid: 4326,
            // },
            rings: [
              geometry_value[0].map((e) => {
                return e;
              }),
            ],
          };
          const simplePolygonSymbol = {
            type: "simple-fill",
            outline: {
              color: [200, 0, 0],
              width: 2,
            },
          };
          const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simplePolygonSymbol,
          });
          graphicsLayer.add(polygonGraphic);
          view.when(() => {
            sketchVM.update(polygonGraphic);
            getArea(polygonGraphic.geometry);
          });
        } else if (e.geometry.type === "MultiPolygon") {
          console.log("1");
        } else if (e.geometry.type === "LineString") {
          var geometry_value = e.geometry.coordinates;
          console.log(geometry_value);
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: geometry_value,
            },
            properties: {},
          });
          const polyline = {
            type: "polyline",
            paths: geometry_value, //Longitude, latitude
          };
          const simpleLineSymbol = {
            type: "simple-line",
            color: [226, 119, 40], // Orange
            width: 2,
          };
          const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: simpleLineSymbol,
          });
          graphicsLayer.add(polylineGraphic);
          view.when(() => {
            sketchVM.update(polylineGraphic);
            getArea(polylineGraphic.geometry);
          });
        } else {
          var geometry_value = e.geometry.coordinates;
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [geometry_value[0], geometry_value[1]],
            },
            properties: {},
          });
          const point = {
            //Create a point
            type: "point",
            longitude: geometry_value[0],
            latitude: geometry_value[1],
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 3,
            },
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
          });
          graphicsLayer.add(pointGraphic);
          view.when(() => {
            sketchVM.update(pointGraphic);
            getArea(pointGraphic.geometry);
          });
        }
      });

      const sketchVM = new SketchViewModel({
        view: view,
        layer: graphicsLayer,
        creationMode: "update",
        updateOnGraphicClick: true,
      });

      sketchVM.on("update", (e) => {
        const geometry = e.graphics[0].geometry;
        // console.log(
        //   geometry_value[0].map((e) => {
        //     return e;
        //   })
        // );
        if (e.state === "start") {
          switchType(geometry);
        }

        if (e.state === "complete") {
          // graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
          // measurements.innerHTML = null;
        }

        if (
          e.toolEventInfo &&
          (e.toolEventInfo.type === "scale-stop" ||
            e.toolEventInfo.type === "reshape-stop" ||
            e.toolEventInfo.type === "move-stop")
        ) {
          switchType(geometry);
        }
      });

      function getArea(polygon) {
        const geodesicArea = geometryEngine.geodesicArea(
          polygon,
          "square-kilometers"
        );
        const planarArea = geometryEngine.planarArea(
          polygon,
          "square-kilometers"
        );

        measurements.innerHTML =
          "<b>Geodesic area</b>:  " +
          geodesicArea.toFixed(2) +
          " km\xB2" +
          " |   <b>Planar area</b>: " +
          planarArea.toFixed(2) +
          "  km\xB2";
      }

      function getLength(line) {
        const geodesicLength = geometryEngine.geodesicLength(
          line,
          "kilometers"
        );
        const planarLength = geometryEngine.planarLength(line, "kilometers");

        measurements.innerHTML =
          "<b>Geodesic length</b>:  " +
          geodesicLength.toFixed(2) +
          " km" +
          " |   <b>Planar length</b>: " +
          planarLength.toFixed(2) +
          "  km";
      }

      function switchType(geom) {
        // console.log(webMercatorUtils.webMercatorToGeographic(geom).toJSON());
        switch (geom.type) {
          case "polygon":
            getArea(geom);

            break;
          case "polyline":
            getLength(geom);
            break;
          default:
            console.log("No value found");
        }
      }

      // Add the calcite-panel for the styler to an Expand to hide/show the panel
      const stylerExpand = new Expand({
        view: view,
        content: document.getElementById("propPanel"),
        expanded: false,
        expandIconClass: "esri-icon-edit",
        expandTooltip: "Open Styler",
      });

      // Add SnappingControls to handle snapping
      const snappingControls = new SnappingControls({
        view: view,

        // Sets the widget to use the SketchViewModel's SnappingOptions
        snappingOptions: sketchVM.snappingOptions,
      });

      // Add the SnappingControls to an Expand widget to hide/show the widget
      const snappingExpand = new Expand({
        view: view,
        // container: document.getElementById("snap"),
        content: snappingControls,
        expanded: false,
        expandIconClass: "esri-icon-settings2",
        expandTooltip: "Snapping Controls",
      });

      view.when(() => {
        const print = new Print({
          view: view,
          // specify your own print service
          printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
          container: "export",
        });
        // Configure the UI to use the default property values from our SketchViewModel
        setDefaultCreateOptions();
        setDefaultUpdateOptions();
        setDefaultPointSymbol();
        setDefaultPolylineSymbol();
        setDefaultPolygonSymbol();
      });

      view.ui.add(stylerExpand, "bottom-right");
      view.ui.add(snappingExpand, "top-left");
      // Add the calcite panel
      // Add the Expand with SnappingControls widget
      // view.ui.add(shortcutKeysExpand, "top-left");

      // Connecting the calcite actions with their corresponding SketchViewModel tools
      const pointBtn = document.getElementById("pointBtn");
      const polylineBtn = document.getElementById("polylineBtn");
      const polygonBtn = document.getElementById("polygonBtn");
      const circleBtn = document.getElementById("circleBtn");
      const rectangleBtn = document.getElementById("rectangleBtn");
      const clearBtn = document.getElementById("clearBtn");
      const selectBtn = document.getElementById("selectBtn");

      pointBtn.style.position = "absolute";
      pointBtn.style.zIndex = "10";

      pointBtn.style.top = "0%";

      sketchVM.on("create", function (event) {
        if (event.state === "complete") {
          var geom = event.graphic.geometry;
          var value = webMercatorUtils.webMercatorToGeographic(geom).toJSON();

          switch (geom.type) {
            case "polygon":
              console.log("polygon");

              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "Polygon",

                  coordinates: value.rings.map((info) => {
                    return info.map((e) => {
                      return e;
                    });
                  }),
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            case "polyline":
              console.log("polyline");
              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: value.paths[0].map((info) => {
                    return info.map((e) => {
                      return e;
                    });
                  }),
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            case "point":
              console.log("point");
              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [value.x, value.y],
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            default:
              console.log("No value found");
          }
        } else {
        }
      });

      pointBtn.onclick = (e) => {
        sketchVM.create("point");
        console.log(document.getElementById("point-style-select").value);
      };
      polylineBtn.onclick = () => {
        sketchVM.create("polyline");
      };
      polygonBtn.onclick = () => {
        sketchVM.create("polygon");
      };
      circleBtn.onclick = () => {
        sketchVM.create("circle");
      };
      rectangleBtn.onclick = () => {
        sketchVM.create("rectangle");
      };
      clearBtn.onclick = () => {
        sketchVM.layer.removeAll();
      };
      selectBtn.onclick = () => {
        sketchVM.cancel();
      };

      // Calcite UI logic
      // Auto-populate UI with default SketchViewModel properties set.
      // If no default values are set, UI will be set accordingly.
      function setDefaultCreateOptions() {
        const options = sketchVM.defaultCreateOptions;
        const modeSelect = document.getElementById("mode-select");

        // set default mode in the select element if defined
        if (options?.mode) {
          setDefaultOption(modeSelect, options.mode);
        }

        // handles mode select changes
        modeSelect.addEventListener("calciteSelectChange", () => {
          sketchVM.defaultCreateOptions["mode"] =
            modeSelect.selectedOption.value;
        });
      }

      function setDefaultUpdateOptions() {
        const options = sketchVM.defaultUpdateOptions;
        const rotationSwitch = document.getElementById("rotationSwitch");
        const scaleSwitch = document.getElementById("scaleSwitch");
        const multipleSelectionSwitch = document.getElementById(
          "multipleSelectionSwitch"
        );
        const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");

        // set the UI elements to the default property values
        rotationSwitch.switched = options.enableRotation;
        scaleSwitch.switched = options.enableScaling;
        multipleSelectionSwitch.switched = options.multipleSelectionEnabled;
        aspectRatioSwitch.switched = options.preserveAspectRatio;

        // event listeners for UI interactions
        rotationSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.enableRotation = evt.target.switched;
        });
        scaleSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.enableScaling = evt.target.switched;
        });
        multipleSelectionSwitch.addEventListener(
          "calciteSwitchChange",
          (evt) => {
            sketchVM.defaultUpdateOptions.multipleSelectionEnabled =
              evt.target.switched;
          }
        );
        aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.preserveAspectRatio =
            evt.target.switched;
        });
      }

      function setDefaultPointSymbol() {
        const pointSymbol = sketchVM.pointSymbol;
        const pointStyleSelect = document.getElementById("point-style-select");
        const pointSymbolOutlineBtn =
          document.getElementById("point-outline-btn");
        const pointSizeInput = document.getElementById("point-size-input");
        const pointXOffsetInput = document.getElementById(
          "point-xoffset-input"
        );
        const pointYOffsetInput = document.getElementById(
          "point-yoffset-input"
        );
        const pointAngleInput = document.getElementById("point-angle-input");
        const pointColorInput = document.getElementById("point-color-input");
        const slsWidthInput = document.getElementById("point-sls-width-input");
        const slsColorInput = document.getElementById("point-sls-color-input");

        pointSizeInput.value = pointSymbol.size;
        pointXOffsetInput.value = pointSymbol.xoffset;
        pointYOffsetInput.value = pointSymbol.yoffset;
        pointAngleInput.value = pointSymbol.angle;
        slsWidthInput.value = pointSymbol.outline.width;

        // set default style in the select element
        setDefaultOption(pointStyleSelect, pointSymbol.style);

        pointSizeInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.size = parseInt(evt.target.value);
        });
        pointXOffsetInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.xoffset = parseInt(evt.target.value);
        });
        pointYOffsetInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.yoffset = parseInt(evt.target.value);
        });
        pointAngleInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.angle = parseInt(evt.target.value);
        });
        pointStyleSelect.addEventListener("calciteSelectChange", () => {
          pointSymbol.style = pointStyleSelect.selectedOption.value;
        });
        pointColorInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.color = evt.target.value;
        });
        pointSymbolOutlineBtn.onclick = () => {
          openModal("point-outline-modal");
        };
        // point outline modal event listeners
        slsWidthInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.outline.width = parseInt(evt.target.value);
        });
        slsColorInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.outline.color = evt.target.value;
        });
      }

      function setDefaultPolylineSymbol() {
        const lineSymbol = sketchVM.polylineSymbol;
        const lineStyleSelect = document.getElementById("line-style-select");
        const lineWidthInput = document.getElementById("line-width-input");
        const lineColorInput = document.getElementById("line-color-input");

        lineWidthInput.value = lineSymbol.width;

        // set default style in the select element
        setDefaultOption(lineStyleSelect, lineSymbol.style);

        lineStyleSelect.addEventListener("calciteSelectChange", () => {
          lineSymbol.style = lineStyleSelect.selectedOption.value;
        });
        lineWidthInput.addEventListener("calciteInputInput", (evt) => {
          lineSymbol.width = parseInt(evt.target.value);
        });
        lineColorInput.addEventListener("calciteInputInput", (evt) => {
          lineSymbol.color = evt.target.value;
        });
      }

      function setDefaultPolygonSymbol() {
        const polygonSymbol = sketchVM.polygonSymbol;
        const polygonStyleSelect = document.getElementById(
          "polygon-style-select"
        );
        console.log(polygonStyleSelect);
        const polygonSymbolOutlineBtn = document.getElementById(
          "polygon-outline-btn"
        );
        const polygonColorInput = document.getElementById(
          "polygon-color-input"
        );
        const slsStyleSelect = document.getElementById(
          "polygon-sls-style-select"
        );
        const slsWidthInput = document.getElementById(
          "polygon-sls-width-input"
        );
        const slsColorInput = document.getElementById(
          "polygon-sls-color-input"
        );

        slsWidthInput.value = polygonSymbol.outline.width;

        // set default style in the select element
        setDefaultOption(polygonStyleSelect, polygonSymbol.style);
        setDefaultOption(slsStyleSelect, polygonSymbol.outline.style);

        polygonStyleSelect.addEventListener("calciteSelectChange", () => {
          polygonSymbol.style = polygonStyleSelect.selectedOption.value;
        });
        polygonColorInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.color = evt.target.value;
        });
        polygonSymbolOutlineBtn.onclick = () => {
          openModal("polygon-outline-modal");
        };
        // polygon outline modal event listeners
        slsStyleSelect.addEventListener("calciteSelectChange", () => {
          polygonSymbol.outline.style = slsStyleSelect.selectedOption.value;
        });
        slsWidthInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.outline.width = parseInt(evt.target.value);
        });
        slsColorInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.outline.color = evt.target.value;
        });
      }

      // function to auto-populate calcite select components
      function setDefaultOption(selectElement, value) {
        for (let i = 0; i < selectElement.children.length; i++) {
          let option = selectElement.children[i];
          if (option.value === value) {
            option.selected = true;
          }
        }
      }

      // displays the appropriate modals
      function openModal(id) {
        document.getElementById(id).active = true;
      }

      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "9px 15px 5px";

      view.ui.add(coordsWidget, "bottom-right");

      view.watch("stationary", function (isStationary) {
        showCoordinates(view.center);
      });
      function showCoordinates(pt) {
        //*** UPDATE ***//
        var coords =
          "  Scale 1:" +
          Math.round(view.scale * 1) / 1 +
          " | Zoom " +
          view.zoom;
        coordsWidget.innerHTML = coords;
      }
      view.on("pointer-move", function (evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
      });
      var coordinateConversionWidget = new CoordinateConversion({
        view: view,
      });

      view.ui.add(coordinateConversionWidget, "bottom-left");
    });
  };

  GetFile.readAsText(this.files[0]);
});

function imptDATA(e) {
  axios.get("http://localhost:8080/api/geolocation/id/" + e).then((res) => {
    var layer = res.data[0].data[0].features;

    require([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/layers/FeatureLayer",
      "esri/widgets/LayerList",
      "esri/widgets/BasemapGallery",
      "esri/widgets/ScaleBar",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/widgets/support/SnappingControls",
      "esri/widgets/Search",
      "esri/widgets/Locate",
      "esri/widgets/Track",
      "esri/widgets/Expand",
      "esri/geometry/support/webMercatorUtils",
      "esri/widgets/CoordinateConversion",
      "esri/geometry/geometryEngine",
      "esri/widgets/Print",
    ], (
      esriConfig,
      Map,
      MapView,
      Graphic,
      GraphicsLayer,
      FeatureLayer,
      LayerList,
      BasemapGallery,
      ScaleBar,
      SketchViewModel,
      SnappingControls,
      Search,
      Locate,
      Track,
      Expand,
      webMercatorUtils,
      CoordinateConversion,
      geometryEngine,
      Print
    ) => {
      esriConfig.apiKey =
        "AAPK98c50a3510cc4cb9a07dc3116113843cqZssDSqHkgmBfOp_v5GIAETd4ggp7oleJJQPSyr9NmmTf-2GSs7swp9zS6T42ny7";
      const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });

      const map = new Map({
        basemap: bmap,
        layers: [graphicsLayer],
      });

      const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 10,
        center: [x, y],
      });

      const scalebar = new ScaleBar({
        view: view,
        unit: "metric",
      });

      view.ui.add(scalebar, "bottom-right");

      const measurements = document.getElementById("measurements");
      view.ui.add(measurements, "manual");

      const basemapGallery = new BasemapGallery({
        view: view,
        container: document.getElementById("map"),
        source: {
          query: {
            title: '"World Basemaps for Developers" AND owner:esri',
          },
        },
      });
      const search = new Search({
        //Add Search widget
        view: view,
      });
      const track = new Track({
        view: view,
        graphic: new Graphic({
          symbol: {
            type: "simple-marker",
            size: "12px",
            color: "red",
            outline: {
              color: "#efefef",
              width: "1.5px",
            },
          },
        }),
        useHeadingEnabled: false,
      });

      view.ui.add(search, "top-left");
      view.ui.add(track, "top-left");
      // console.log(layer);
      layer.map((e) => {
        if (e.geometry.type === "Polygon") {
          var geometry_value = e.geometry.coordinates;
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: geometry_value.map((info) => {
                return info.map((e) => {
                  return e;
                });
              }),
            },
            properties: { id: Data.features.length + 1 },
          });
          // console.log(
          //   geometry_value[0].map((e) => {
          //     return e;
          //   })
          // );
          const polygon = {
            type: "polygon",
            // spatialReference: {
            //   wkid: 4326,
            // },
            rings: [
              geometry_value[0].map((e) => {
                return e;
              }),
            ],
          };

          const simplePolygonSymbol = {
            type: "simple-fill",
            outline: {
              color: [200, 0, 0],
              width: 2,
            },
          };

          const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simplePolygonSymbol,
          });

          graphicsLayer.add(polygonGraphic);

          view.when(() => {
            sketchVM.update(polygonGraphic);
            getArea(polygonGraphic.geometry);
          });
        } else if (e.geometry.type === "LineString") {
          var geometry_value = e.geometry.coordinates;
          console.log(geometry_value);

          Data.features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: geometry_value,
            },
            properties: { id: Data.features.length + 1 },
          });
          const polyline = {
            type: "polyline",
            paths: geometry_value, //Longitude, latitude
          };
          const simpleLineSymbol = {
            type: "simple-line",
            color: [226, 119, 40], // Orange
            width: 2,
          };

          const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: simpleLineSymbol,
          });
          graphicsLayer.add(polylineGraphic);
          view.when(() => {
            sketchVM.update(polylineGraphic);
            getArea(polylineGraphic.geometry);
          });
        } else {
          var geometry_value = e.geometry.coordinates;
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [geometry_value[0], geometry_value[1]],
            },
            properties: { id: Data.features.length + 1 },
          });
          const point = {
            //Create a point
            type: "point",
            longitude: geometry_value[0],
            latitude: geometry_value[1],
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 3,
            },
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
          });
          graphicsLayer.add(pointGraphic);
          view.when(() => {
            sketchVM.update(pointGraphic);
            getArea(pointGraphic.geometry);
          });
        }
      });

      const sketchVM = new SketchViewModel({
        view: view,
        layer: graphicsLayer,
        creationMode: "update",
        updateOnGraphicClick: true,
      });

      sketchVM.on("update", (e) => {
        const geometry = e.graphics[0].geometry;
        // console.log(
        //   geometry_value[0].map((e) => {
        //     return e;
        //   })
        // );
        if (e.state === "start") {
          switchType(geometry);
        }

        if (e.state === "complete") {
          // graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
          // measurements.innerHTML = null;
        }

        if (
          e.toolEventInfo &&
          (e.toolEventInfo.type === "scale-stop" ||
            e.toolEventInfo.type === "reshape-stop" ||
            e.toolEventInfo.type === "move-stop")
        ) {
          switchType(geometry);
        }
      });

      function getArea(polygon) {
        const geodesicArea = geometryEngine.geodesicArea(
          polygon,
          "square-kilometers"
        );
        const planarArea = geometryEngine.planarArea(
          polygon,
          "square-kilometers"
        );

        measurements.innerHTML =
          "<b>Geodesic area</b>:  " +
          geodesicArea.toFixed(2) +
          " km\xB2" +
          " |   <b>Planar area</b>: " +
          planarArea.toFixed(2) +
          "  km\xB2";
      }

      function getLength(line) {
        const geodesicLength = geometryEngine.geodesicLength(
          line,
          "kilometers"
        );
        const planarLength = geometryEngine.planarLength(line, "kilometers");

        measurements.innerHTML =
          "<b>Geodesic length</b>:  " +
          geodesicLength.toFixed(2) +
          " km" +
          " |   <b>Planar length</b>: " +
          planarLength.toFixed(2) +
          "  km";
      }

      function switchType(geom) {
        // console.log(webMercatorUtils.webMercatorToGeographic(geom).toJSON());
        switch (geom.type) {
          case "polygon":
            getArea(geom);

            break;
          case "polyline":
            getLength(geom);
            break;
          default:
            console.log("No value found");
        }
      }

      // Add the calcite-panel for the styler to an Expand to hide/show the panel
      const stylerExpand = new Expand({
        view: view,
        content: document.getElementById("propPanel"),
        expanded: false,
        expandIconClass: "esri-icon-edit",
        expandTooltip: "Open Styler",
      });

      // Add SnappingControls to handle snapping
      const snappingControls = new SnappingControls({
        view: view,

        // Sets the widget to use the SketchViewModel's SnappingOptions
        snappingOptions: sketchVM.snappingOptions,
      });

      // Add the SnappingControls to an Expand widget to hide/show the widget
      const snappingExpand = new Expand({
        view: view,
        // container: document.getElementById("snap"),
        content: snappingControls,
        expanded: false,
        expandIconClass: "esri-icon-settings2",
        expandTooltip: "Snapping Controls",
      });

      view.when(() => {
        const print = new Print({
          view: view,
          // specify your own print service
          printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
          container: "export",
        });
        // Configure the UI to use the default property values from our SketchViewModel
        setDefaultCreateOptions();
        setDefaultUpdateOptions();
        setDefaultPointSymbol();
        setDefaultPolylineSymbol();
        setDefaultPolygonSymbol();
      });

      view.ui.add(stylerExpand, "bottom-right");
      view.ui.add(snappingExpand, "top-left");
      // Add the calcite panel
      // Add the Expand with SnappingControls widget
      // view.ui.add(shortcutKeysExpand, "top-left");

      // Connecting the calcite actions with their corresponding SketchViewModel tools
      const pointBtn = document.getElementById("pointBtn");
      const polylineBtn = document.getElementById("polylineBtn");
      const polygonBtn = document.getElementById("polygonBtn");
      const circleBtn = document.getElementById("circleBtn");
      const rectangleBtn = document.getElementById("rectangleBtn");
      const clearBtn = document.getElementById("clearBtn");
      const selectBtn = document.getElementById("selectBtn");

      pointBtn.style.position = "absolute";
      pointBtn.style.zIndex = "10";

      pointBtn.style.top = "0%";

      sketchVM.on("create", function (event) {
        if (event.state === "complete") {
          var geom = event.graphic.geometry;
          var value = webMercatorUtils.webMercatorToGeographic(geom).toJSON();

          switch (geom.type) {
            case "polygon":
              console.log("polygon");

              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "Polygon",

                  coordinates: value.rings.map((info) => {
                    return info.map((e) => {
                      return e;
                    });
                  }),
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            case "polyline":
              console.log("polyline");
              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: value.paths[0].map((info) => {
                    return info.map((e) => {
                      return e;
                    });
                  }),
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            case "point":
              console.log("point");
              Data.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [value.x, value.y],
                },
                properties: { id: Data.features.length + 1 },
              });
              console.log(Data);
              break;
            default:
              console.log("No value found");
          }
        } else {
        }
      });

      pointBtn.onclick = (e) => {
        sketchVM.create("point");
      };
      polylineBtn.onclick = () => {
        sketchVM.create("polyline");
      };
      polygonBtn.onclick = () => {
        sketchVM.create("polygon");
      };
      circleBtn.onclick = () => {
        sketchVM.create("circle");
      };
      rectangleBtn.onclick = () => {
        sketchVM.create("rectangle");
      };
      clearBtn.onclick = () => {
        sketchVM.layer.removeAll();
      };
      selectBtn.onclick = () => {
        sketchVM.cancel();
      };

      // Calcite UI logic
      // Auto-populate UI with default SketchViewModel properties set.
      // If no default values are set, UI will be set accordingly.
      function setDefaultCreateOptions() {
        const options = sketchVM.defaultCreateOptions;
        const modeSelect = document.getElementById("mode-select");

        // set default mode in the select element if defined
        if (options?.mode) {
          setDefaultOption(modeSelect, options.mode);
        }

        // handles mode select changes
        modeSelect.addEventListener("calciteSelectChange", () => {
          sketchVM.defaultCreateOptions["mode"] =
            modeSelect.selectedOption.value;
        });
      }

      function setDefaultUpdateOptions() {
        const options = sketchVM.defaultUpdateOptions;
        const rotationSwitch = document.getElementById("rotationSwitch");
        const scaleSwitch = document.getElementById("scaleSwitch");
        const multipleSelectionSwitch = document.getElementById(
          "multipleSelectionSwitch"
        );
        const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");

        // set the UI elements to the default property values
        rotationSwitch.switched = options.enableRotation;
        scaleSwitch.switched = options.enableScaling;
        multipleSelectionSwitch.switched = options.multipleSelectionEnabled;
        aspectRatioSwitch.switched = options.preserveAspectRatio;

        // event listeners for UI interactions
        rotationSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.enableRotation = evt.target.switched;
        });
        scaleSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.enableScaling = evt.target.switched;
        });
        multipleSelectionSwitch.addEventListener(
          "calciteSwitchChange",
          (evt) => {
            sketchVM.defaultUpdateOptions.multipleSelectionEnabled =
              evt.target.switched;
          }
        );
        aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
          sketchVM.defaultUpdateOptions.preserveAspectRatio =
            evt.target.switched;
        });
      }

      function setDefaultPointSymbol() {
        const pointSymbol = sketchVM.pointSymbol;
        const pointStyleSelect = document.getElementById("point-style-select");
        const pointSymbolOutlineBtn =
          document.getElementById("point-outline-btn");
        const pointSizeInput = document.getElementById("point-size-input");
        const pointXOffsetInput = document.getElementById(
          "point-xoffset-input"
        );
        const pointYOffsetInput = document.getElementById(
          "point-yoffset-input"
        );
        const pointAngleInput = document.getElementById("point-angle-input");
        const pointColorInput = document.getElementById("point-color-input");
        const slsWidthInput = document.getElementById("point-sls-width-input");
        const slsColorInput = document.getElementById("point-sls-color-input");

        pointSizeInput.value = pointSymbol.size;
        pointXOffsetInput.value = pointSymbol.xoffset;
        pointYOffsetInput.value = pointSymbol.yoffset;
        pointAngleInput.value = pointSymbol.angle;
        slsWidthInput.value = pointSymbol.outline.width;

        // set default style in the select element
        setDefaultOption(pointStyleSelect, pointSymbol.style);

        pointSizeInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.size = parseInt(evt.target.value);
        });
        pointXOffsetInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.xoffset = parseInt(evt.target.value);
        });
        pointYOffsetInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.yoffset = parseInt(evt.target.value);
        });
        pointAngleInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.angle = parseInt(evt.target.value);
        });
        pointStyleSelect.addEventListener("calciteSelectChange", () => {
          pointSymbol.style = pointStyleSelect.selectedOption.value;
        });
        pointColorInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.color = evt.target.value;
        });
        pointSymbolOutlineBtn.onclick = () => {
          openModal("point-outline-modal");
        };
        // point outline modal event listeners
        slsWidthInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.outline.width = parseInt(evt.target.value);
        });
        slsColorInput.addEventListener("calciteInputInput", (evt) => {
          pointSymbol.outline.color = evt.target.value;
        });
      }

      function setDefaultPolylineSymbol() {
        const lineSymbol = sketchVM.polylineSymbol;
        const lineStyleSelect = document.getElementById("line-style-select");
        const lineWidthInput = document.getElementById("line-width-input");
        const lineColorInput = document.getElementById("line-color-input");

        lineWidthInput.value = lineSymbol.width;

        // set default style in the select element
        setDefaultOption(lineStyleSelect, lineSymbol.style);

        lineStyleSelect.addEventListener("calciteSelectChange", () => {
          lineSymbol.style = lineStyleSelect.selectedOption.value;
        });
        lineWidthInput.addEventListener("calciteInputInput", (evt) => {
          lineSymbol.width = parseInt(evt.target.value);
        });
        lineColorInput.addEventListener("calciteInputInput", (evt) => {
          lineSymbol.color = evt.target.value;
        });
      }

      function setDefaultPolygonSymbol() {
        const polygonSymbol = sketchVM.polygonSymbol;
        const polygonStyleSelect = document.getElementById(
          "polygon-style-select"
        );
        const polygonSymbolOutlineBtn = document.getElementById(
          "polygon-outline-btn"
        );
        const polygonColorInput = document.getElementById(
          "polygon-color-input"
        );
        const slsStyleSelect = document.getElementById(
          "polygon-sls-style-select"
        );
        const slsWidthInput = document.getElementById(
          "polygon-sls-width-input"
        );
        const slsColorInput = document.getElementById(
          "polygon-sls-color-input"
        );

        slsWidthInput.value = polygonSymbol.outline.width;

        // set default style in the select element
        setDefaultOption(polygonStyleSelect, polygonSymbol.style);
        setDefaultOption(slsStyleSelect, polygonSymbol.outline.style);

        polygonStyleSelect.addEventListener("calciteSelectChange", () => {
          polygonSymbol.style = polygonStyleSelect.selectedOption.value;
        });
        polygonColorInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.color = evt.target.value;
        });
        polygonSymbolOutlineBtn.onclick = () => {
          openModal("polygon-outline-modal");
        };
        // polygon outline modal event listeners
        slsStyleSelect.addEventListener("calciteSelectChange", () => {
          polygonSymbol.outline.style = slsStyleSelect.selectedOption.value;
        });
        slsWidthInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.outline.width = parseInt(evt.target.value);
        });
        slsColorInput.addEventListener("calciteInputInput", (evt) => {
          polygonSymbol.outline.color = evt.target.value;
        });
      }

      // function to auto-populate calcite select components
      function setDefaultOption(selectElement, value) {
        for (let i = 0; i < selectElement.children.length; i++) {
          let option = selectElement.children[i];
          if (option.value === value) {
            option.selected = true;
          }
        }
      }

      // displays the appropriate modals
      function openModal(id) {
        document.getElementById(id).active = true;
      }

      var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "9px 15px 5px";

      view.ui.add(coordsWidget, "bottom-right");

      view.watch("stationary", function (isStationary) {
        showCoordinates(view.center);
      });
      function showCoordinates(pt) {
        //*** UPDATE ***//
        var coords =
          "  Scale 1:" +
          Math.round(view.scale * 1) / 1 +
          " | Zoom " +
          view.zoom;
        coordsWidget.innerHTML = coords;
      }
      view.on("pointer-move", function (evt) {
        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
      });
      var coordinateConversionWidget = new CoordinateConversion({
        view: view,
      });

      view.ui.add(coordinateConversionWidget, "bottom-left");
    });
  });
}

// console.log(project);

require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/LayerList",
  "esri/widgets/BasemapGallery",
  "esri/widgets/ScaleBar",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/widgets/support/SnappingControls",
  "esri/widgets/Search",
  "esri/widgets/Locate",
  "esri/widgets/Track",
  "esri/widgets/Expand",
  "esri/geometry/support/webMercatorUtils",
  "esri/widgets/CoordinateConversion",
  "esri/geometry/geometryEngine",
  "esri/widgets/Print",
], (
  esriConfig,
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  FeatureLayer,
  LayerList,
  BasemapGallery,
  ScaleBar,
  SketchViewModel,
  SnappingControls,
  Search,
  Locate,
  Track,
  Expand,
  webMercatorUtils,
  CoordinateConversion,
  geometryEngine,
  Print
) => {
  esriConfig.apiKey =
    "AAPK98c50a3510cc4cb9a07dc3116113843cqZssDSqHkgmBfOp_v5GIAETd4ggp7oleJJQPSyr9NmmTf-2GSs7swp9zS6T42ny7";
  const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });

  const map = new Map({
    basemap: bmap,
    layers: [graphicsLayer],
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 10,
    center: [x, y],
  });

  const scalebar = new ScaleBar({
    view: view,
    unit: "metric",
  });

  view.ui.add(scalebar, "bottom-right");

  const measurements = document.getElementById("measurements");
  view.ui.add(measurements, "manual");

  const basemapGallery = new BasemapGallery({
    view: view,
    container: document.getElementById("map"),
    source: {
      query: {
        title: '"World Basemaps for Developers" AND owner:esri',
      },
    },
  });
  const search = new Search({
    //Add Search widget
    view: view,
  });
  const track = new Track({
    view: view,
    graphic: new Graphic({
      symbol: {
        type: "simple-marker",
        size: "12px",
        color: "red",
        outline: {
          color: "#efefef",
          width: "1.5px",
        },
      },
    }),
    useHeadingEnabled: false,
  });

  view.ui.add(search, "top-left");
  view.ui.add(track, "top-left");

  const sketchVM = new SketchViewModel({
    view: view,
    layer: graphicsLayer,
    creationMode: "update",
    updateOnGraphicClick: true,
  });

  sketchVM.on("update", (e) => {
    const geometry = e.graphics[0].geometry;

    if (e.state === "start") {
      switchType(geometry);
    }

    if (e.state === "complete") {
      // graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
      // measurements.innerHTML = null;
    }

    if (
      e.toolEventInfo &&
      (e.toolEventInfo.type === "scale-stop" ||
        e.toolEventInfo.type === "reshape-stop" ||
        e.toolEventInfo.type === "move-stop")
    ) {
      switchType(geometry);
    }
  });

  function getArea(polygon) {
    const geodesicArea = geometryEngine.geodesicArea(
      polygon,
      "square-kilometers"
    );
    const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");

    measurements.innerHTML =
      "<b>Geodesic area</b>:  " +
      geodesicArea.toFixed(2) +
      " km\xB2" +
      " |   <b>Planar area</b>: " +
      planarArea.toFixed(2) +
      "  km\xB2";
  }

  function getLength(line) {
    const geodesicLength = geometryEngine.geodesicLength(line, "kilometers");
    const planarLength = geometryEngine.planarLength(line, "kilometers");

    measurements.innerHTML =
      "<b>Geodesic length</b>:  " +
      geodesicLength.toFixed(2) +
      " km" +
      " |   <b>Planar length</b>: " +
      planarLength.toFixed(2) +
      "  km";
  }

  function switchType(geom) {
    console.log(webMercatorUtils.webMercatorToGeographic(geom).toJSON());
    switch (geom.type) {
      case "polygon":
        getArea(geom);

        break;
      case "polyline":
        getLength(geom);
        break;
      default:
        console.log("No value found");
    }
  }

  // Add the calcite-panel for the styler to an Expand to hide/show the panel
  const stylerExpand = new Expand({
    view: view,
    content: document.getElementById("propPanel"),
    expanded: false,
    expandIconClass: "esri-icon-edit",
    expandTooltip: "Open Styler",
  });

  // Add SnappingControls to handle snapping
  const snappingControls = new SnappingControls({
    view: view,

    // Sets the widget to use the SketchViewModel's SnappingOptions
    snappingOptions: sketchVM.snappingOptions,
  });

  // Add the SnappingControls to an Expand widget to hide/show the widget
  const snappingExpand = new Expand({
    view: view,
    // container: document.getElementById("snap"),
    content: snappingControls,
    expanded: false,
    expandIconClass: "esri-icon-settings2",
    expandTooltip: "Snapping Controls",
  });

  view.when(() => {
    const print = new Print({
      view: view,
      // specify your own print service
      printServiceUrl:
        "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      container: "export",
    });
    // Configure the UI to use the default property values from our SketchViewModel
    setDefaultCreateOptions();
    setDefaultUpdateOptions();
    setDefaultPointSymbol();
    setDefaultPolylineSymbol();
    setDefaultPolygonSymbol();
  });

  view.ui.add(stylerExpand, "bottom-right");
  view.ui.add(snappingExpand, "top-left");
  // Add the calcite panel
  // Add the Expand with SnappingControls widget
  // view.ui.add(shortcutKeysExpand, "top-left");

  // Connecting the calcite actions with their corresponding SketchViewModel tools
  const pointBtn = document.getElementById("pointBtn");
  const polylineBtn = document.getElementById("polylineBtn");
  const polygonBtn = document.getElementById("polygonBtn");
  const circleBtn = document.getElementById("circleBtn");
  const rectangleBtn = document.getElementById("rectangleBtn");
  const clearBtn = document.getElementById("clearBtn");
  const selectBtn = document.getElementById("selectBtn");

  pointBtn.style.position = "absolute";
  pointBtn.style.zIndex = "10";

  pointBtn.style.top = "0%";

  sketchVM.on("create", function (event) {
    if (event.state === "complete") {
      var geom = event.graphic.geometry;
      var value = webMercatorUtils.webMercatorToGeographic(geom).toJSON();

      switch (geom.type) {
        case "polygon":
          console.log("polygon");
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: value.rings.map((info) => {
                return info.map((e) => {
                  return e;
                });
              }),
            },
            properties: { id: Data.features.length + 1 },
          });
          console.log(Data);
          break;
        case "polyline":
          console.log("polyline");
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: value.paths[0].map((info) => {
                return info.map((e) => {
                  return e;
                });
              }),
            },
            properties: { id: Data.features.length + 1 },
          });
          console.log(Data);
          break;
        case "point":
          console.log("point");
          Data.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [value.x, value.y],
            },
            properties: { id: Data.features.length + 1 },
          });
          console.log(Data);
          break;
        default:
          console.log("No value found");
      }
    } else {
    }
  });

  pointBtn.onclick = (e) => {
    sketchVM.create("point");
  };
  polylineBtn.onclick = () => {
    sketchVM.create("polyline");
  };
  polygonBtn.onclick = () => {
    sketchVM.create("polygon");
  };
  circleBtn.onclick = () => {
    sketchVM.create("circle");
  };
  rectangleBtn.onclick = () => {
    sketchVM.create("rectangle");
  };
  clearBtn.onclick = () => {
    sketchVM.layer.removeAll();
  };
  selectBtn.onclick = () => {
    sketchVM.cancel();
  };

  // Calcite UI logic
  // Auto-populate UI with default SketchViewModel properties set.
  // If no default values are set, UI will be set accordingly.
  function setDefaultCreateOptions() {
    const options = sketchVM.defaultCreateOptions;
    const modeSelect = document.getElementById("mode-select");

    // set default mode in the select element if defined
    if (options?.mode) {
      setDefaultOption(modeSelect, options.mode);
    }

    // handles mode select changes
    modeSelect.addEventListener("calciteSelectChange", () => {
      sketchVM.defaultCreateOptions["mode"] = modeSelect.selectedOption.value;
    });
  }

  function setDefaultUpdateOptions() {
    const options = sketchVM.defaultUpdateOptions;
    const rotationSwitch = document.getElementById("rotationSwitch");
    const scaleSwitch = document.getElementById("scaleSwitch");
    const multipleSelectionSwitch = document.getElementById(
      "multipleSelectionSwitch"
    );
    const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");

    // set the UI elements to the default property values
    rotationSwitch.switched = options.enableRotation;
    scaleSwitch.switched = options.enableScaling;
    multipleSelectionSwitch.switched = options.multipleSelectionEnabled;
    aspectRatioSwitch.switched = options.preserveAspectRatio;

    // event listeners for UI interactions
    rotationSwitch.addEventListener("calciteSwitchChange", (evt) => {
      sketchVM.defaultUpdateOptions.enableRotation = evt.target.switched;
    });
    scaleSwitch.addEventListener("calciteSwitchChange", (evt) => {
      sketchVM.defaultUpdateOptions.enableScaling = evt.target.switched;
    });
    multipleSelectionSwitch.addEventListener("calciteSwitchChange", (evt) => {
      sketchVM.defaultUpdateOptions.multipleSelectionEnabled =
        evt.target.switched;
    });
    aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
      sketchVM.defaultUpdateOptions.preserveAspectRatio = evt.target.switched;
    });
  }

  function setDefaultPointSymbol() {
    const pointSymbol = sketchVM.pointSymbol;
    const pointStyleSelect = document.getElementById("point-style-select");
    const pointSymbolOutlineBtn = document.getElementById("point-outline-btn");
    const pointSizeInput = document.getElementById("point-size-input");
    const pointXOffsetInput = document.getElementById("point-xoffset-input");
    const pointYOffsetInput = document.getElementById("point-yoffset-input");
    const pointAngleInput = document.getElementById("point-angle-input");
    const pointColorInput = document.getElementById("point-color-input");
    const slsWidthInput = document.getElementById("point-sls-width-input");
    const slsColorInput = document.getElementById("point-sls-color-input");

    pointSizeInput.value = pointSymbol.size;
    pointXOffsetInput.value = pointSymbol.xoffset;
    pointYOffsetInput.value = pointSymbol.yoffset;
    pointAngleInput.value = pointSymbol.angle;
    slsWidthInput.value = pointSymbol.outline.width;

    // set default style in the select element
    setDefaultOption(pointStyleSelect, pointSymbol.style);

    pointSizeInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.size = parseInt(evt.target.value);
    });
    pointXOffsetInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.xoffset = parseInt(evt.target.value);
    });
    pointYOffsetInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.yoffset = parseInt(evt.target.value);
    });
    pointAngleInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.angle = parseInt(evt.target.value);
    });
    pointStyleSelect.addEventListener("calciteSelectChange", () => {
      pointSymbol.style = pointStyleSelect.selectedOption.value;
    });
    pointColorInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.color = evt.target.value;
    });
    pointSymbolOutlineBtn.onclick = () => {
      openModal("point-outline-modal");
    };
    // point outline modal event listeners
    slsWidthInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.outline.width = parseInt(evt.target.value);
    });
    slsColorInput.addEventListener("calciteInputInput", (evt) => {
      pointSymbol.outline.color = evt.target.value;
    });
  }

  function setDefaultPolylineSymbol() {
    const lineSymbol = sketchVM.polylineSymbol;
    const lineStyleSelect = document.getElementById("line-style-select");
    const lineWidthInput = document.getElementById("line-width-input");
    const lineColorInput = document.getElementById("line-color-input");

    lineWidthInput.value = lineSymbol.width;

    // set default style in the select element
    setDefaultOption(lineStyleSelect, lineSymbol.style);

    lineStyleSelect.addEventListener("calciteSelectChange", () => {
      lineSymbol.style = lineStyleSelect.selectedOption.value;
    });
    lineWidthInput.addEventListener("calciteInputInput", (evt) => {
      lineSymbol.width = parseInt(evt.target.value);
    });
    lineColorInput.addEventListener("calciteInputInput", (evt) => {
      lineSymbol.color = evt.target.value;
    });
  }

  function setDefaultPolygonSymbol() {
    const polygonSymbol = sketchVM.polygonSymbol;
    const polygonStyleSelect = document.getElementById("polygon-style-select");
    const polygonSymbolOutlineBtn = document.getElementById(
      "polygon-outline-btn"
    );
    const polygonColorInput = document.getElementById("polygon-color-input");
    const slsStyleSelect = document.getElementById("polygon-sls-style-select");
    const slsWidthInput = document.getElementById("polygon-sls-width-input");
    const slsColorInput = document.getElementById("polygon-sls-color-input");

    slsWidthInput.value = polygonSymbol.outline.width;

    // set default style in the select element
    setDefaultOption(polygonStyleSelect, polygonSymbol.style);
    setDefaultOption(slsStyleSelect, polygonSymbol.outline.style);

    polygonStyleSelect.addEventListener("calciteSelectChange", () => {
      polygonSymbol.style = polygonStyleSelect.selectedOption.value;
    });
    polygonColorInput.addEventListener("calciteInputInput", (evt) => {
      polygonSymbol.color = evt.target.value;
    });
    polygonSymbolOutlineBtn.onclick = () => {
      openModal("polygon-outline-modal");
    };
    // polygon outline modal event listeners
    slsStyleSelect.addEventListener("calciteSelectChange", () => {
      polygonSymbol.outline.style = slsStyleSelect.selectedOption.value;
    });
    slsWidthInput.addEventListener("calciteInputInput", (evt) => {
      polygonSymbol.outline.width = parseInt(evt.target.value);
    });
    slsColorInput.addEventListener("calciteInputInput", (evt) => {
      polygonSymbol.outline.color = evt.target.value;
    });
  }

  // function to auto-populate calcite select components
  function setDefaultOption(selectElement, value) {
    for (let i = 0; i < selectElement.children.length; i++) {
      let option = selectElement.children[i];
      if (option.value === value) {
        option.selected = true;
      }
    }
  }

  // displays the appropriate modals
  function openModal(id) {
    document.getElementById(id).active = true;
  }

  var coordsWidget = document.createElement("div");
  coordsWidget.id = "coordsWidget";
  coordsWidget.className = "esri-widget esri-component";
  coordsWidget.style.padding = "9px 15px 5px";

  view.ui.add(coordsWidget, "bottom-right");

  view.watch("stationary", function (isStationary) {
    showCoordinates(view.center);
  });
  function showCoordinates(pt) {
    //*** UPDATE ***//
    var coords =
      "  Scale 1:" + Math.round(view.scale * 1) / 1 + " | Zoom " + view.zoom;
    coordsWidget.innerHTML = coords;
  }
  view.on("pointer-move", function (evt) {
    showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
  });
  var coordinateConversionWidget = new CoordinateConversion({
    view: view,
  });

  view.ui.add(coordinateConversionWidget, "bottom-left");
});
var openValue = false;
function Import() {
  sample();
  if (openValue == false) {
    document.getElementById("selectmap").style.display = "block";
    document.getElementById("selectmap").style.transition = "1";

    openValue = true;
  } else {
    document.getElementById("selectmap").style.display = "none";

    openValue = false;
  }
}

var BaseMap = false;

function basemap() {
  if (BaseMap === false) {
    document.getElementById("map").style.right = "1%";
    BaseMap = true;
  } else {
    document.getElementById("map").style.right = "-100%";
    BaseMap = false;
  }
}

function Layer() {
  require([
    "esri/config",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/support/SnappingControls",
    "esri/Map",
    "esri/layers/GraphicsLayer",
    "esri/views/MapView",
    "esri/widgets/Expand",

    "esri/widgets/Locate",
    "esri/geometry/support/webMercatorUtils",
    "esri/widgets/Track",
    "esri/Graphic",
    "esri/widgets/Search",
    "esri/widgets/CoordinateConversion",

    "esri/widgets/BasemapGallery",

    "esri/layers/FeatureLayer",

    "esri/widgets/LayerList",
  ], (
    esriConfig,
    SketchViewModel,
    SnappingControls,
    Map,
    GraphicsLayer,
    MapView,
    Expand,
    Locate,
    webMercatorUtils,

    Track,
    Graphic,
    Search,
    CoordinateConversion,

    BasemapGallery,

    FeatureLayer,

    LayerList
  ) => {
    esriConfig.apiKey =
      "AAPK98c50a3510cc4cb9a07dc3116113843cqZssDSqHkgmBfOp_v5GIAETd4ggp7oleJJQPSyr9NmmTf-2GSs7swp9zS6T42ny7";
    const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });

    const map = new Map({
      basemap: "arcgis-imagery",
      layers: [graphicsLayer],
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 4,
      center: [-100.521191, 55.069323],
    });

    //

    const layerList = new LayerList({
      view: view,

      container: document.getElementById("layer"),
    });

    const Parks_Protected_Areas = new FeatureLayer({
      url: "https://services3.arcgis.com/KD7TtlnkhprHYJ7K/arcgis/rest/services/parks_protected_areas/FeatureServer/0",
    });

    map.add(Parks_Protected_Areas, 0);

    const EOS = new FeatureLayer({
      url: "https://services3.arcgis.com/KD7TtlnkhprHYJ7K/arcgis/rest/services/eos_sensitivearea/FeatureServer/0",
    });

    map.add(EOS, 0);

    const Crown_Reservations = new FeatureLayer({
      url: "https://services3.arcgis.com/KD7TtlnkhprHYJ7K/arcgis/rest/services/crown_reservations/FeatureServer/0",
    });

    map.add(Crown_Reservations, 0);
    const SoilLandsCape = new FeatureLayer({
      url: " https://services3.arcgis.com/KD7TtlnkhprHYJ7K/arcgis/rest/services/soillandscape/FeatureServer/0",
    });

    map.add(SoilLandsCape, 0);

    //

    const basemapGallery = new BasemapGallery({
      view: view,
      container: document.getElementById("map"),
      source: {
        query: {
          title: '"World Basemaps for Developers" AND owner:esri',
        },
      },
    });
    const search = new Search({
      //Add Search widget
      view: view,
    });
    const track = new Track({
      view: view,
      graphic: new Graphic({
        symbol: {
          type: "simple-marker",
          size: "12px",
          color: "red",
          outline: {
            color: "#efefef",
            width: "1.5px",
          },
        },
      }),
      useHeadingEnabled: false,
    });

    view.ui.add(search, "top-left");
    view.ui.add(track, "top-left");

    const sketchVM = new SketchViewModel({
      view: view,
      layer: graphicsLayer,
    });

    // Add the calcite-panel for the styler to an Expand to hide/show the panel
    const stylerExpand = new Expand({
      view: view,
      content: document.getElementById("propPanel"),
      expanded: false,
      expandIconClass: "esri-icon-edit",
      expandTooltip: "Open Styler",
    });

    // Add SnappingControls to handle snapping
    const snappingControls = new SnappingControls({
      view: view,

      // Sets the widget to use the SketchViewModel's SnappingOptions
      snappingOptions: sketchVM.snappingOptions,
    });

    // Add the SnappingControls to an Expand widget to hide/show the widget
    const snappingExpand = new Expand({
      view: view,
      // container: document.getElementById("snap"),
      content: snappingControls,
      expanded: false,
      expandIconClass: "esri-icon-settings2",
      expandTooltip: "Snapping Controls",
    });

    // Add the shortcut key description panel to an Expand widget
    // const shortcutKeysExpand = new Expand({
    //   view: view,
    //   content: document.getElementById("sketchVM-controls"),
    //   expanded: false,
    //   color: "red",
    //   expandIconClass: "esri-icon-description",
    //   expandTooltip: "Keyboard Shortcuts",
    // });

    view.when(() => {
      const sketch = new SketchViewModel({
        layer: graphicsLayer,
        view: view,
      });

      // Configure the UI to use the default property values from our SketchViewModel
      setDefaultCreateOptions();
      setDefaultUpdateOptions();
      setDefaultPointSymbol();
      setDefaultPolylineSymbol();
      setDefaultPolygonSymbol();
    });

    view.ui.add(stylerExpand, "bottom-right");
    view.ui.add(snappingExpand, "top-left");
    // Add the calcite panel
    // Add the Expand with SnappingControls widget
    // view.ui.add(shortcutKeysExpand, "top-left");

    // Connecting the calcite actions with their corresponding SketchViewModel tools
    const pointBtn = document.getElementById("pointBtn");
    const polylineBtn = document.getElementById("polylineBtn");
    const polygonBtn = document.getElementById("polygonBtn");
    const circleBtn = document.getElementById("circleBtn");
    const rectangleBtn = document.getElementById("rectangleBtn");
    const clearBtn = document.getElementById("clearBtn");
    const selectBtn = document.getElementById("selectBtn");

    sketchVM.on("create", function (event) {
      let coordinte;
      if (event.state === "complete") {
        var obj = prompt("Name of the shape");
        coordinte = [
          webMercatorUtils
            .webMercatorToGeographic(event.graphic.geometry)
            .toJSON(),
        ];
        console.log(coordinte);

        coordinte.map((info) => {
          if (obj != "") {
            if (info.paths != null) {
              fetch(" https://arc-map.herokuapp.com/geolocation", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  shapeName: obj,
                  shapeType: "polyline",
                  geometry: info.paths,
                }),
              })
                .then(function (res) {
                  console.log(res);
                })
                .catch(function (res) {
                  console.log(res);
                });
            } else if (info.x != null) {
              fetch(" https://arc-map.herokuapp.com/geolocation", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  shapeName: obj,
                  shapeType: "point",
                  geometry: [info.x, info.y],
                }),
              })
                .then(function (res) {
                  console.log(res);
                })
                .catch(function (res) {
                  console.log(res);
                });
            } else {
              fetch(" https://arc-map.herokuapp.com/geolocation", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  shapeName: obj,
                  shapeType: "polygon",
                  geometry: [info.rings],
                }),
              })
                .then(function (res) {
                  console.log(res);
                })
                .catch(function (res) {
                  console.log(res);
                });
            }
          } else {
            alert("Give any name for  shape");
          }
        });
      } else {
      }
    });

    pointBtn.onclick = (e) => {
      sketchVM.create("point");
    };
    polylineBtn.onclick = () => {
      sketchVM.create("polyline");
    };
    polygonBtn.onclick = () => {
      sketchVM.create("polygon");
    };
    circleBtn.onclick = () => {
      sketchVM.create("circle");
    };
    rectangleBtn.onclick = () => {
      sketchVM.create("rectangle");
    };
    clearBtn.onclick = () => {
      sketchVM.layer.removeAll();
    };
    selectBtn.onclick = () => {
      sketchVM.cancel();
    };

    // Calcite UI logic
    // Auto-populate UI with default SketchViewModel properties set.
    // If no default values are set, UI will be set accordingly.
    function setDefaultCreateOptions() {
      const options = sketchVM.defaultCreateOptions;
      const modeSelect = document.getElementById("mode-select");

      // set default mode in the select element if defined
      if (options?.mode) {
        setDefaultOption(modeSelect, options.mode);
      }

      // handles mode select changes
      modeSelect.addEventListener("calciteSelectChange", () => {
        sketchVM.defaultCreateOptions["mode"] = modeSelect.selectedOption.value;
      });
    }

    function setDefaultUpdateOptions() {
      const options = sketchVM.defaultUpdateOptions;
      const rotationSwitch = document.getElementById("rotationSwitch");
      const scaleSwitch = document.getElementById("scaleSwitch");
      const multipleSelectionSwitch = document.getElementById(
        "multipleSelectionSwitch"
      );
      const aspectRatioSwitch = document.getElementById("aspectRatioSwitch");

      // set the UI elements to the default property values
      rotationSwitch.switched = options.enableRotation;
      scaleSwitch.switched = options.enableScaling;
      multipleSelectionSwitch.switched = options.multipleSelectionEnabled;
      aspectRatioSwitch.switched = options.preserveAspectRatio;

      // event listeners for UI interactions
      rotationSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.enableRotation = evt.target.switched;
      });
      scaleSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.enableScaling = evt.target.switched;
      });
      multipleSelectionSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.multipleSelectionEnabled =
          evt.target.switched;
      });
      aspectRatioSwitch.addEventListener("calciteSwitchChange", (evt) => {
        sketchVM.defaultUpdateOptions.preserveAspectRatio = evt.target.switched;
      });
    }

    function setDefaultPointSymbol() {
      const pointSymbol = sketchVM.pointSymbol;
      const pointStyleSelect = document.getElementById("point-style-select");
      const pointSymbolOutlineBtn =
        document.getElementById("point-outline-btn");
      const pointSizeInput = document.getElementById("point-size-input");
      const pointXOffsetInput = document.getElementById("point-xoffset-input");
      const pointYOffsetInput = document.getElementById("point-yoffset-input");
      const pointAngleInput = document.getElementById("point-angle-input");
      const pointColorInput = document.getElementById("point-color-input");
      const slsWidthInput = document.getElementById("point-sls-width-input");
      const slsColorInput = document.getElementById("point-sls-color-input");

      pointSizeInput.value = pointSymbol.size;
      pointXOffsetInput.value = pointSymbol.xoffset;
      pointYOffsetInput.value = pointSymbol.yoffset;
      pointAngleInput.value = pointSymbol.angle;
      slsWidthInput.value = pointSymbol.outline.width;

      // set default style in the select element
      setDefaultOption(pointStyleSelect, pointSymbol.style);

      pointSizeInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.size = parseInt(evt.target.value);
      });
      pointXOffsetInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.xoffset = parseInt(evt.target.value);
      });
      pointYOffsetInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.yoffset = parseInt(evt.target.value);
      });
      pointAngleInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.angle = parseInt(evt.target.value);
      });
      pointStyleSelect.addEventListener("calciteSelectChange", () => {
        pointSymbol.style = pointStyleSelect.selectedOption.value;
      });
      pointColorInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.color = evt.target.value;
      });
      pointSymbolOutlineBtn.onclick = () => {
        openModal("point-outline-modal");
      };
      // point outline modal event listeners
      slsWidthInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.outline.width = parseInt(evt.target.value);
      });
      slsColorInput.addEventListener("calciteInputInput", (evt) => {
        pointSymbol.outline.color = evt.target.value;
      });
    }

    function setDefaultPolylineSymbol() {
      const lineSymbol = sketchVM.polylineSymbol;
      const lineStyleSelect = document.getElementById("line-style-select");
      const lineWidthInput = document.getElementById("line-width-input");
      const lineColorInput = document.getElementById("line-color-input");

      lineWidthInput.value = lineSymbol.width;

      // set default style in the select element
      setDefaultOption(lineStyleSelect, lineSymbol.style);

      lineStyleSelect.addEventListener("calciteSelectChange", () => {
        lineSymbol.style = lineStyleSelect.selectedOption.value;
      });
      lineWidthInput.addEventListener("calciteInputInput", (evt) => {
        lineSymbol.width = parseInt(evt.target.value);
      });
      lineColorInput.addEventListener("calciteInputInput", (evt) => {
        lineSymbol.color = evt.target.value;
      });
    }

    function setDefaultPolygonSymbol() {
      const polygonSymbol = sketchVM.polygonSymbol;
      const polygonStyleSelect = document.getElementById(
        "polygon-style-select"
      );
      const polygonSymbolOutlineBtn = document.getElementById(
        "polygon-outline-btn"
      );
      const polygonColorInput = document.getElementById("polygon-color-input");
      const slsStyleSelect = document.getElementById(
        "polygon-sls-style-select"
      );
      const slsWidthInput = document.getElementById("polygon-sls-width-input");
      const slsColorInput = document.getElementById("polygon-sls-color-input");

      slsWidthInput.value = polygonSymbol.outline.width;

      // set default style in the select element
      setDefaultOption(polygonStyleSelect, polygonSymbol.style);
      setDefaultOption(slsStyleSelect, polygonSymbol.outline.style);

      polygonStyleSelect.addEventListener("calciteSelectChange", () => {
        polygonSymbol.style = polygonStyleSelect.selectedOption.value;
      });
      polygonColorInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.color = evt.target.value;
      });
      polygonSymbolOutlineBtn.onclick = () => {
        openModal("polygon-outline-modal");
      };
      // polygon outline modal event listeners
      slsStyleSelect.addEventListener("calciteSelectChange", () => {
        polygonSymbol.outline.style = slsStyleSelect.selectedOption.value;
      });
      slsWidthInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.outline.width = parseInt(evt.target.value);
      });
      slsColorInput.addEventListener("calciteInputInput", (evt) => {
        polygonSymbol.outline.color = evt.target.value;
      });
    }

    // function to auto-populate calcite select components
    function setDefaultOption(selectElement, value) {
      for (let i = 0; i < selectElement.children.length; i++) {
        let option = selectElement.children[i];
        if (option.value === value) {
          option.selected = true;
        }
      }
    }

    // displays the appropriate modals
    function openModal(id) {
      document.getElementById(id).active = true;
    }

    var coordsWidget = document.createElement("div");
    coordsWidget.id = "coordsWidget";
    coordsWidget.className = "esri-widget esri-component";
    coordsWidget.style.padding = "9px 15px 5px";

    view.ui.add(coordsWidget, "bottom-right");

    view.watch("stationary", function (isStationary) {
      showCoordinates(view.center);
    });
    function showCoordinates(pt) {
      //*** UPDATE ***//
      var coords =
        "  Scale 1:" + Math.round(view.scale * 1) / 1 + " | Zoom " + view.zoom;
      coordsWidget.innerHTML = coords;
    }
    view.on("pointer-move", function (evt) {
      showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
    });
    var coordinateConversionWidget = new CoordinateConversion({
      view: view,
    });

    view.ui.add(coordinateConversionWidget, "bottom-left");
  });
}
