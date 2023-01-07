import { Nodes, Edges, Layouts } from "v-network-graph"
import { reactive } from "vue"

const nodes: Nodes = reactive({
  node0: { name: "Node 0" },
  node1: { name: "Node 1" },
  node2: { name: "Node 2" },
  node3: { name: "Node 3" },
  node4: { name: "Node 4" },
  node5: { name: "Node 5" },
})

const edges: Edges = reactive({
  edge0: { source: "node0", target: "node1" },
  edge1: { source: "node1", target: "node2" },
  edge2: { source: "node2", target: "node3" },
  edge3: { source: "node3", target: "node4" },
  edge4: { source: "node4", target: "node5" },
  edge5: { source: "node5", target: "node0" },

})

const layouts: Layouts = reactive({
  nodes: {
    node0: { x: -100, y: -90 , fixed: true},
    node1: { x: 0, y: 0 , fixed: true},
    node2: { x: 50, y: 50 },
    node3: { x: 100, y: 0 },
    node4: { x: 150, y: 50 },
  },
})

export default {
  nodes,
  edges,
  layouts,
}