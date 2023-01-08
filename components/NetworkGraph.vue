<script setup lang="ts">
import { reactive, ref, watch } from "vue"
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
import dagre from "dagre/dist/dagre.min.js"

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

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
      selectable: node => node.selectable,
      draggable: node => node.draggable,
      normal: { 
        radius: nodeSize / 2 ,
        color: n => (n.id === "node0" ? "#ff0000" : "#4466cc"),
      },
      label: { 
        direction: "south",
        //direction: "center", color: "#fff", 
        visible: true,
        directionAutoAdjustment: true,
      },
    },
    edge: {
      selectable: true,
      normal: {
        color: "#aaa",
        width: 3,
      },
      margin: 4,
      marker: {
        target: {
          type: "arrow",
          width: 4,
          height: 4,
        },
      },
    },
  })
)
function layout(direction: "TB" | "LR") {
  if (Object.keys(data.nodes).length <= 1 || Object.keys(data.edges).length == 0) {
    return
  }

  // convert graph
  // ref: https://github.com/dagrejs/dagre/wiki
  const g = new dagre.graphlib.Graph()
  // Set an object for the graph label
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSize * 2,
    edgesep: nodeSize,
    ranksep: nodeSize * 2,
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  Object.entries(data.nodes).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize })
  })

  // Add edges to the graph.
  Object.values(data.edges).forEach(edge => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  const box: Record<string, number | undefined> = {}
  g.nodes().forEach((nodeId: string) => {
    // update node position
    const x = g.node(nodeId).x
    const y = g.node(nodeId).y
    data.layouts.nodes[nodeId] = { x, y }

    // calculate bounding box size
    box.top = box.top ? Math.min(box.top, y) : y
    box.bottom = box.bottom ? Math.max(box.bottom, y) : y
    box.left = box.left ? Math.min(box.left, x) : x
    box.right = box.right ? Math.max(box.right, x) : x
  })

  const graphMargin = nodeSize * 2
  const viewBox = {
    top: (box.top ?? 0) - graphMargin,
    bottom: (box.bottom ?? 0) + graphMargin,
    left: (box.left ?? 0) - graphMargin,
    right: (box.right ?? 0) + graphMargin,
  }
  graph.value?.setViewBox(viewBox)
}

function updateLayout(direction: "TB" | "LR") {
  // Animates the movement of an element.
  graph.value?.transitionWhile(() => {
    layout(direction)
  })
}
const zoomLevel = ref(1.5)
</script>

<template>
  <div class="demo-control-panel">
    <v-checkbox v-model="configs.view.scalingObjects">Scaling objects</v-checkbox>
    <v-slider v-model="zoomLevel" ></v-slider>
    <v-checkbox v-model="d3ForceEnabled" label="D3-Force enabled" />
    <v-btn @click="updateLayout('LR')">Layout: Left to Right</v-btn>
    <v-btn @click="updateLayout('TB')">Layout: Top to Bottom</v-btn>
  </div>
  <v-network-graph
    ref="graph"
    class="graph"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    v-model:zoom-level="zoomLevel"
    :nodes="data.nodes"
    :edges="data.edges"
    :layouts="data.layouts"
    :configs="configs"
  /> 
</template>