<template>
  <main>
    <div id="app">
      <h1>Let's Find Some Candy!</h1>
      <h2>
        You can find candy caches at these locations in Wellesley. Follow the
        clues and be safe!
      </h2>
      <div id="myMap"></div>
    </div>
  </main>
</template>
<script>
import * as atlas from "azure-maps-control";
import data from "@/assets/sites.json";

export default {
  name: "app",
  data: () => ({
    map: null,
    zoom: 15,
    center: [-71.2757724, 42.3123219],
  }),
  methods: {
    async initMap() {
      this.map = new atlas.Map("myMap", {
        center: this.center,
        zoom: this.zoom,
        view: "Auto",
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: process.env["VUE_APP_MAP_KEY"],
        },
      });
      await this.buildMap();
    },
    buildMap() {
      let self = this;
      self.map.events.add("ready", function () {
        //Create a data source and add it to the map.
        let mapSource = new atlas.source.DataSource();
        self.map.sources.add(mapSource);
        mapSource.add(data);

        let popupSource = new atlas.source.DataSource();
        self.map.sources.add(popupSource);
        popupSource.add(data);
        //add a popup
        var symbolLayer = new atlas.layer.SymbolLayer(popupSource);

        //Add the polygon and line the symbol layer to the map.
        self.map.layers.add(symbolLayer);
        var popupTemplate =
          '<div style="padding:10px;color:white;font-size:11pt;font-weight:bold">{clue}<br/>{sitename}<br/>{refShort}<br/>{time}</div>';

        //Create a popup but leave it closed so we can update it and display it later.
        let popup = new atlas.Popup({
          pixelOffset: [0, -18],
          closeButton: true,
          fillColor: "rgba(0,0,0,0.8)",
        });

        //Add a hover event to the symbol layer.
        self.map.events.add("mouseover", symbolLayer, function (e) {
          //Make sure that the point exists.
          if (e.shapes && e.shapes.length > 0) {
            var content, coordinate;
            var properties = e.shapes[0].getProperties();
            content = popupTemplate
              .replace(/{clue}/g, properties.clue)
              .replace(/{sitename}/g, properties.sitename)
              .replace(/{refShort}/g, properties.refShort)
              .replace(/{time}/g, properties.time);
            coordinate = e.shapes[0].getCoordinates();

            popup.setOptions({
              content: content,
              position: coordinate,
            });

            popup.open(self.map);
          }
        });

        self.map.events.add("mouseleave", symbolLayer, function () {
          popup.close();
        });
      });
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style scoped>
#myMap {
  height: 75vh;
  width: 100vw;
}
</style>
