/**
 * CIVILIZATION GRAPH ENGINE — V7 (Core)
 *
 * Builds and evolves the civilization graph from users, worlds, and nodes.
 *
 * V7 §2: buildCivilizationGraph(users, worlds, nodes) → graph
 *
 * Graph structure:
 *   - nodes: user nodes, world nodes, cultural memory nodes
 *   - edges: user→world, world→world, node→memory connections
 *   - clusters: behavior clusters from collective intelligence
 *
 * V7 §3: Users become behavior nodes, pattern generators, cultural contributors.
 *        System tracks movement patterns, exploration paths, relic acquisition, AR frequency.
 *
 * V7 §6: Civilization Evolution Loop:
 *   User actions → World changes → Memory updates → Graph evolution →
 *   New world behaviors → Back to user experience
 */

/**
 * Create a civilization graph from users, worlds, and nodes.
 *
 * V7 §2:
 *   For each user: connect(user.behavior → world_nodes)
 *   For each world: connect(world → other_worlds)
 *   For each node: connect(node → cultural_memory)
 *
 * @param {Object[]} users — array of user behavior objects
 *        Each user: { id, name, movement_patterns: [...], exploration_paths: [...],
 *                     relic_acquisitions: [...], ar_interaction_frequency: number }
 * @param {Object[]} worlds — array of world summary objects (from multi-world engine)
 * @param {Object[]} nodes — array of world architecture nodes with metadata
 * @returns {Object} — civilization graph
 */
function buildCivilizationGraph(users, worlds, nodes) {
  if (!users || !worlds || !nodes) {
    throw new Error('[CIV_GRAPH] Users, worlds, and nodes are all required');
  }

  var graph = {
    nodes: [],
    edges: [],
    clusters: []
  };

  // ---- Step 1: Build user nodes ----
  // V7 §3: Users become behavior nodes.
  users.forEach(function (user) {
    var userNode = {
      id: 'user_' + (user.id || user.name || 'unknown'),
      type: 'user',
      name: user.name || 'User_' + (user.id || 'unknown'),
      behaviors: {
        movement_patterns: user.movement_patterns || [],
        exploration_paths: user.exploration_paths || [],
        relic_acquisitions: user.relic_acquisitions || [],
        ar_interaction_frequency: user.ar_interaction_frequency || 0
      }
    };
    graph.nodes.push(userNode);
  });

  // ---- Step 2: Build world nodes ----
  worlds.forEach(function (world) {
    var worldNode = {
      id: 'world_' + world.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      type: 'world',
      name: world.name,
      world_type: world.type,
      node_count: world.node_count
    };
    graph.nodes.push(worldNode);
  });

  // ---- Step 3: Build cultural memory nodes ----
  // V7 §4: Cultural Memory stores shared discoveries and collective achievements.
  var memoryTopics = ['shared_discoveries', 'collective_achievements', 'world_evolution', 'ar_cultural_events'];
  memoryTopics.forEach(function (topic, idx) {
    var memoryNode = {
      id: 'memory_' + topic,
      type: 'cultural_memory',
      name: topic.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }),
      topic: topic,
      content: []
    };
    graph.nodes.push(memoryNode);
  });

  // ---- Step 4: Build edges ----

  // 4a: User → World edges (based on exploration paths)
  users.forEach(function (user) {
    var userId = 'user_' + (user.id || user.name || 'unknown');

    // For each world the user has explored
    if (user.exploration_paths) {
      user.exploration_paths.forEach(function (path) {
        var worldId = 'world_' + path.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (graph.nodes.some(function (n) { return n.id === worldId; })) {
          var edge = {
            source: userId,
            target: worldId,
            type: 'user_exploration',
            weight: 1.0
          };
          // Avoid duplicates
          if (!graph.edges.some(function (e) { return e.source === edge.source && e.target === edge.target; })) {
            graph.edges.push(edge);
          }
        }
      });
    }

    // 4a: User behavior → world nodes
    if (nodes && nodes.length > 0 && user.movement_patterns) {
      var matchedNodes = nodes.filter(function (n) {
        return user.movement_patterns.some(function (mp) {
          return n.location && n.location.indexOf(mp) !== -1;
        });
      });
      matchedNodes.forEach(function (mn) {
        graph.edges.push({
          source: userId,
          target: mn.id,
          type: 'user_node_interaction',
          weight: 0.7
        });
      });
    }
  });

  // 4b: World → World edges
  for (var wi = 0; wi < worlds.length; wi++) {
    for (var wj = wi + 1; wj < worlds.length; wj++) {
      var wA = worlds[wi];
      var wB = worlds[wj];
      var aId = 'world_' + (wA.name || 'World_' + wi).toLowerCase().replace(/[^a-z0-9]/g, '_');
      var bId = 'world_' + (wB.name || 'World_' + wj).toLowerCase().replace(/[^a-z0-9]/g, '_');
      graph.edges.push({
        source: aId,
        target: bId,
        type: 'world_connection',
        weight: 0.6
      });
    }
  }

  // 4c: Node → Cultural Memory edges
  if (nodes && nodes.length > 0) {
    nodes.forEach(function (node) {
      var targetMemory = 'memory_shared_discoveries';
      graph.edges.push({
        source: node.id,
        target: targetMemory,
        type: 'node_memory',
        weight: 0.5
      });
    });
  }

  // ---- Step 5: Build clusters (V7 §3 Collective Intelligence) ----
  var clusters = [];
  // Cluster by user behavior patterns
  var patternClusters = {};

  users.forEach(function (user) {
    var userId = 'user_' + (user.id || user.name || 'unknown');

    user.exploration_paths.forEach(function (path) {
      if (!patternClusters[path]) {
        patternClusters[path] = { pattern: path, users: [], count: 0 };
      }
      patternClusters[path].users.push(userId);
      patternClusters[path].count++;
    });
  });

  Object.keys(patternClusters).forEach(function (key) {
    if (patternClusters[key].count >= 1) {
      clusters.push({
        id: 'cluster_' + key.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        type: 'behavior_pattern',
        pattern: key,
        users: patternClusters[key].users,
        size: patternClusters[key].count
      });
    }
  });

  graph.clusters = clusters;

  console.log('[CIV_GRAPH] Built graph: ' + graph.nodes.length + ' nodes, ' +
    graph.edges.length + ' edges, ' + graph.clusters.length + ' clusters');

  return graph;
}

/**
 * Update the civilization graph based on new user actions.
 *
 * V7 §6: Civilization Evolution Loop iteration.
 *
 * @param {Object} graph — existing civilization graph
 * @param {Object} userAction — { userId, actionType, target, data }
 * @returns {Object} — { updated_graph, world_changes, memory_updates, evolution_log }
 */
function evolveCivilization(graph, userAction) {
  if (!graph || !userAction) {
    throw new Error('[CIV_EVOLVE] Graph and user action are required');
  }

  var log = [];

  // Step 1: Process user action
  log.push({ state: 'USER_ACTION', detail: userAction.actionType + ' by ' + userAction.userId });

  // Step 2: World changes
  var worldChanges = [];
  if (userAction.target && graph.nodes.some(function (n) { return n.id === userAction.target; })) {
    worldChanges.push({ world: userAction.target, change: 'state_update', trigger: userAction.actionType });
  }
  log.push({ state: 'WORLD_CHANGE', detail: worldChanges.length + ' worlds affected' });

  // Step 3: Memory updates
  var memoryUpdates = [];
  if (userAction.data && userAction.data.memoryContribution) {
    memoryUpdates.push({
      memory_id: 'memory_shared_discoveries',
      contribution: userAction.data.memoryContribution,
      source: userAction.userId
    });
  }
  log.push({ state: 'MEMORY_UPDATE', detail: memoryUpdates.length + ' memory contributions' });

  // Step 4: Graph evolution (add edge for action)
  if (userAction.target) {
    graph.edges.push({
      source: userAction.userId,
      target: userAction.target,
      type: 'action_' + userAction.actionType,
      weight: 0.8
    });
  }
  log.push({ state: 'GRAPH_EVOLUTION', detail: '1 new edge from action' });

  // Step 5: New behaviors
  var newBehaviors = [];
  if (userAction.actionType === 'discovery') {
    newBehaviors.push({ type: 'exploration_pattern', source: userAction.userId });
  }
  log.push({ state: 'NEW_BEHAVIOR', detail: newBehaviors.length + ' new behavior patterns' });

  // Step 6: Return to user experience
  log.push({ state: 'USER_EXPERIENCE', detail: 'Evolved state ready for user' });

  return {
    updated_graph: graph,
    world_changes: worldChanges,
    memory_updates: memoryUpdates,
    evolution_log: log
  };
}

module.exports = {
  buildCivilizationGraph: buildCivilizationGraph,
  evolveCivilization: evolveCivilization
};
