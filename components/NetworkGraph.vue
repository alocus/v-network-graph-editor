<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import * as vNG from "v-network-graph"
import data from "../stores/data"
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"

// dagre: Directed graph layout for JavaScript
// https://github.com/dagrejs/dagre
//@ts-ignore
// import dagre from "dagre/dist/dagre.min.js"

const graph = ref<vNG.VNetworkGraphInstance>()

const nodeSize = 40


const d3ForceEnabled = computed({
  get: () => configs.view.layoutHandler instanceof ForceLayout,
  set: (value: boolean) => {
    if (value) {
      configs.view.layoutHandler = new ForceLayout()
    } else {
      configs.view.layoutHandler = new vNG.SimpleLayout()
    }
  },
})

const configs = reactive(
  vNG.defineConfigs({
    view: {
      scalingObjects: true,
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
        // * The following are the default parameters for the simulation.
        // * You can customize it by uncommenting below.
        // createSimulation: (d3, nodes, edges) => {
        //   const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
        //   return d3
        //     .forceSimulation(nodes)
        //     .force("edge", forceLink.distance(100))
        //     .force("charge", d3.forceManyBody())
        //     .force("collide", d3.forceCollide(50).strength(0.2))
        //     .force("center", d3.forceCenter().strength(0.05))
        //     .alphaMin(0.001)
        // }
      }),
    },
    node: {
      normal: {
        color: n => (n.id === "node2" ? "#ff0000" : "#4466cc"),
      },
      
      label: {
        visible: false,
      },
    },
  })
)


const zoomLevel = ref(1.5)
</script>

<template>
  <div class="demo-control-panel">
    <v-checkbox v-model="configs.view.scalingObjects">Scaling objects</v-checkbox>
    <v-slider v-model="zoomLevel" ></v-slider>
    <v-checkbox v-model="d3ForceEnabled" label="D3-Force enabled" />
    <!-- <v-button @click="updateLayout('LR')">Layout: Left to Right</v-button>
    <v-button @click="updateLayout('TB')">Layout: Top to Bottom</v-button> -->
  </div>
  <v-network-graph
    ref="graph"
    class="graph"
    v-model:zoom-level="zoomLevel"
    :nodes="data.nodes"
    :edges="data.edges"
    :layouts="data.layouts"
    :configs="configs"
  /> 
</template>