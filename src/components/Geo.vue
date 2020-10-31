<template>
  <main>
    <div id="app">
      <h2>
        You can find candy caches at these {{ getNumSites }} locations in
        Wellesley. Follow the clues and be safe!
      </h2>
      <p>
        Looking for a list of sites?
        <router-link to="list">Check them out here</router-link>
      </p>
      <div id="myMap"></div>
    </div>
  </main>
</template>
<script>
import * as atlas from "azure-maps-control";
import data from "@/assets/sites.json";
import axios from "axios";
export default {
  name: "app",
  data: () => ({
    map: null,
    zoom: 13,
    center: [-71.2757724, 42.3123219],
    subKey: null,
    numSites: 0,
  }),
  computed: {
    getNumSites() {
      return data.features.length;
    },
  },
  methods: {
    async initMap(key) {
      this.map = new atlas.Map("myMap", {
        center: this.center,
        zoom: this.zoom,
        view: "Auto",
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: key,
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
  async mounted() {
    try {
      //get the key
      const response = await axios.get("/api/getKey");
      this.subKey = response.data;
      //draw the map
      this.initMap(this.subKey);
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style scoped>
#myMap {
  height: 100vh;
  width: 100vw;
}
</style>
