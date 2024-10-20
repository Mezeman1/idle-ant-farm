<template>
  <div>
    <canvas
      ref="canvas"
      class="w-full h-screen"
    />
    <div
      v-if="debugMode"
      class="absolute bottom-4 left-4 right-4 bg-white p-2 rounded shadow-lg max-h-screen-1/5 overflow-y-auto"
    >
      <div class="text-xs text-gray-700">
        <p>Ants: {{ ants.length }} Max: {{ maxAnts }}</p>
        <p>Queens: {{ queens.length }} Max: {{ maxQueens }}</p>
        <p>Larvae: {{ larvae.length }} Max: {{ maxLarvae }}</p>
        <p>FPS: {{ fps.toFixed(1) }}</p>
        <p class="mb-2">
          Average Frame Time: {{ avgFrameTime.toFixed(2) }} ms
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useWindowSize} from '@vueuse/core'
import {useEvolveStore} from '@/stores/evolveStore'
import { useThrottleFn } from '@vueuse/core'


const props = withDefaults(defineProps<{
  antCount: number;
  queenCount: number;
  larvaeCount: number;
  eliteCount?: number;
  showAnimation: boolean;
}>(), {
  antCount: 100,
  queenCount: 10,
  larvaeCount: 50,
  eliteCount: 0,
  showAnimation: true,
})

const debugMode = false

interface AntEntity {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: { width: number; height: number };
  type: 'ant' | 'queen' | 'elite';
  isPaused: boolean;
  pauseTimer: number;
  hasInteracted: boolean;
  color: string;
  isCarryingSeed?: boolean; // New property for ants to track if they are carrying a seed
  targetX?: number; // New property for ants to track the target X position
  targetY?: number; // New property for ants to track the target Y position
  targetSeedId?: number; // New property for ants to track the target seed ID
}

interface LarvaEntity {
  id: number;
  x: number;
  y: number;
}

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const ants = ref<AntEntity[]>([])
const queens = ref<AntEntity[]>([])
const eliteAnts = ref<AntEntity[]>([])
const larvae = ref<LarvaEntity[]>([])
const maxLarvae = computed(() => Math.min(200, Math.floor(screenWidth.value / 5)))
const maxAnts = computed(() => {
  // Max number of ants based on screen size
  return Math.min(1000, Math.floor(screenWidth.value * 2))
})
const maxQueens = computed(() => {
  // Max number of queens based on screen size
  return Math.min(100, Math.floor(screenWidth.value / 100))
})

const maxEliteAnts = computed(() => {
  // Max number of elite ants based on screen size
  return Math.min(100, Math.floor(screenWidth.value / 100))
})

const fps = ref(60)
const avgFrameTime = ref(0)

const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

let frameCount = 0
let lastFrameTime = performance.now()
let lastFpsUpdateTime = performance.now()
let totalFrameTime = 0
let animationFrameId: number
const boundaryMargin = 20
const evolveStore = useEvolveStore()
watch(
  () => evolveStore.currentEvolution,
  () => {
    updateVisualsForEvolution()
    createOffscreenBackground()
  },
)

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

// Initialize ants and queens with random positions, angles, and speeds
const addAnts = (count: number) => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const antsToAdd = Math.min(count, maxAnts.value - ants.value.length)

  for (let i = 0; i < antsToAdd; i++) {
    ants.value.push({
      id: ants.value.length,
      x: centerX + randomInRange(-10, 10), // Spawn near the center
      y: centerY + randomInRange(-10, 10), // Spawn near the center
      angle: Math.random() * 360,
      speed: 0.2 + Math.random() * 0.3,
      size: {width: 4, height: 2},
      type: 'ant',
      isPaused: false,
      pauseTimer: 0,
      hasInteracted: false,
      color: '#4a4541',
    })
  }
}

const removeAnts = (count: number) => {
  ants.value.splice(-count)
}

const addQueens = (count: number) => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const queensToAdd = Math.min(count, maxQueens.value - queens.value.length)

  for (let i = 0; i < queensToAdd; i++) {
    // Generate a random angle between 0 and 2 * PI (360 degrees)
    const angle = Math.random() * Math.PI * 2
    // Generate a random distance from the center, closer to the larvae's cluster
    const radius = randomInRange(0, 60) // Queens are slightly more spread, but near the larvae

    // Use the angle and radius to calculate x and y offsets
    const offsetX = Math.cos(angle) * radius
    const offsetY = Math.sin(angle) * radius

    queens.value.push({
      id: queens.value.length,
      x: centerX + offsetX, // Position close to the larvae
      y: centerY + offsetY, // Position close to the larvae
      angle: Math.random() * 360,
      speed: 0.05 + Math.random() * 0.1, // Queens move slower
      size: {width: 8, height: 4}, // Queens are bigger
      type: 'queen',
      isPaused: false,
      pauseTimer: 0,
      hasInteracted: false,
      color: '#383838',
    })
  }
}

const addEliteAnts = (count: number) => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const antsToAdd = Math.min(count, maxEliteAnts.value - eliteAnts.value.length)

  for (let i = 0; i < antsToAdd; i++) {
    eliteAnts.value.push({
      id: ants.value.length,
      x: centerX + randomInRange(-10, 10), // Spawn near the center
      y: centerY + randomInRange(-10, 10), // Spawn near the center
      angle: Math.random() * 360,
      speed: 0.2 + Math.random() * 0.3,
      size: {width: 8, height: 4},
      type: 'elite',
      isPaused: false,
      pauseTimer: 0,
      hasInteracted: false,
      color: '#e72e2e',
    })
  }
}

const removeEliteAnts = (count: number) => {
  eliteAnts.value.splice(-count)
}

const removeQueens = (count: number) => {
  queens.value.splice(-count)
}

// Initialize and add larvae
const addLarvae = (count: number) => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const larvaeToAdd = Math.min(count, maxLarvae.value - larvae.value.length)

  for (let i = 0; i < larvaeToAdd; i++) {
    // Generate a random angle between 0 and 2 * PI (360 degrees)
    const angle = Math.random() * Math.PI * 2
    // Generate a random distance from the center, constrained to a max radius
    const radius = randomInRange(0, 50) // Adjust the 50 to increase/decrease the cluster size

    // Use the angle and radius to calculate x and y offsets
    const offsetX = Math.cos(angle) * radius
    const offsetY = Math.sin(angle) * radius

    larvae.value.push({
      id: larvae.value.length,
      x: centerX + offsetX, // Position around the center
      y: centerY + offsetY, // Position around the center
    })
  }
}

const removeLarvae = (count: number) => {
  larvae.value.splice(-count)
}

// Main drawing loop for ants, queens, and larvae
// Draw ants and queens
const drawEntities = (entities: AntEntity[]) => {
  const larvaeCenterX = window.innerWidth / 2
  const larvaeCenterY = window.innerHeight / 2
  const queenBoundaryRadius = 100 // Queens can't go beyond this radius from the larvae center

  for (let entity of entities) {
    ctx.value.fillStyle = entity.color
    ctx.value.lineWidth = 0 // Outline thickness

    ctx.value.save()
    ctx.value.translate(entity.x, entity.y)
    ctx.value.rotate((entity.angle * Math.PI) / 180) // Rotate the entity in the correct direction

    if (entity.type === 'queen') {
      ctx.value.fillRect(-entity.size.width, -entity.size.height, entity.size.width, entity.size.height)
    } else {
      // Draw ants (rectangle)
      ctx.value.fillRect(-entity.size.width / 2, -entity.size.height / 2, entity.size.width, entity.size.height)
    }

    ctx.value.restore()

    // Handle pausing behavior for ants and queens
    if (entity.isPaused) {
      entity.pauseTimer -= 1
      if (entity.pauseTimer <= 0) {
        entity.isPaused = false
        entity.pauseTimer = 0
        entity.hasInteracted = false
      }
      continue
    }

    const pauseChance = entity.type === 'ant' ? 0.01 : 0.005
    if (!entity.hasInteracted && Math.random() < pauseChance) {
      entity.isPaused = true
      entity.pauseTimer = entity.type === 'ant' ? randomInRange(50, 150) : randomInRange(200, 500)
      continue
    }

    // Update entity position based on its angle
    const radians = (entity.angle * Math.PI) / 180
    entity.x += Math.cos(radians) * entity.speed
    entity.y += Math.sin(radians) * entity.speed

    // For queens, apply a movement boundary around the larvae cluster
    if (entity.type === 'queen') {
      const distanceFromCenter = Math.sqrt(Math.pow(entity.x - larvaeCenterX, 2) + Math.pow(entity.y - larvaeCenterY, 2))
      const distanceThreshold = 20 // Allow queens to move freely near the boundary

      if (distanceFromCenter > queenBoundaryRadius + distanceThreshold) {
        // Calculate the angle towards the center
        const angleTowardsCenter = Math.atan2(larvaeCenterY - entity.y, larvaeCenterX - entity.x)

        // Gradually adjust the queen's angle toward the center, but avoid abrupt changes
        const adjustmentStrength = 0.05 // Gentle adjustment to avoid "S" movement
        const angleDiff = angleTowardsCenter - (entity.angle * Math.PI / 180) // Calculate difference between current angle and center

        entity.angle += Math.sign(angleDiff) * adjustmentStrength * (180 / Math.PI) // Convert adjustment back to degrees
        entity.angle %= 360 // Keep angle between 0-360 degrees
      }

      // Update queen's position based on the new angle
      const radians = (entity.angle * Math.PI) / 180
      entity.x += Math.cos(radians) * entity.speed
      entity.y += Math.sin(radians) * entity.speed
    }

    // Restrict movement within the canvas with a 20px margin on all sides (for ants)
    if (entity.x < boundaryMargin || entity.x > canvas.value!.width - boundaryMargin) {
      entity.angle = 180 - entity.angle
      entity.x = Math.max(boundaryMargin, Math.min(entity.x, canvas.value!.width - boundaryMargin))
    }
    if (entity.y < boundaryMargin || entity.y > canvas.value!.height - boundaryMargin) {
      entity.angle = -entity.angle
      entity.y = Math.max(boundaryMargin, Math.min(entity.y, canvas.value!.height - boundaryMargin))
    }

    // Occasionally change direction slightly
    if ((entity.type === 'ant' || entity.type === 'elite') && !entity.isCarryingSeed) {

      // Ants change direction more frequently
      if (Math.random() < 0.05) { // Increased probability for ants
        entity.angle += randomInRange(-30, 30)
        entity.angle %= 360
      }
    } else if (entity.type === 'queen') {
      // Queens change direction less frequently
      if (Math.random() < 0.02) { // Lower probability for queens
        entity.angle += randomInRange(-15, 15) // Queens change direction less drastically
        entity.angle %= 360
      }
    }
  }
}


// Draw larvae
const drawLarvae = () => {
  ctx.value!.fillStyle = '#bea68a' // Dark Gray for larvae
  for (let larva of larvae.value) {
    ctx.value.save()
    ctx.value.translate(larva.x, larva.y)
    ctx.value.beginPath()
    ctx.value.ellipse(0, 0, 1, 3, 0, 0, Math.PI * 2) // Taller oval shape (2x4)
    ctx.value.fill()
    ctx.value.restore()
  }
}


let lastSeedRotationTime = 0
let seedRotationAngle = 0

// Main draw function for ants, queens, and larvae
const drawAll = () => {
  const currentTime = performance.now()
  const frameTime = currentTime - lastFrameTime
  lastFrameTime = currentTime
  totalFrameTime += frameTime
  avgFrameTime.value = totalFrameTime / ++frameCount

  if (!ctx.value || !canvas.value) return

  // Clear the canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw the offscreen background
  drawBackground()

  // Draw the collection point
  drawAntNest()

  // Draw all entities
  drawLarvae()
  if (props.showAnimation) {
    drawEntities(ants.value)
    drawEntities(queens.value)
    drawEntities(eliteAnts.value)
    drawSeeds() // Draw seeds only once every second
    updateVisualsForEvolution()
  }

  if (currentTime - lastSeedRotationTime >= 1000) {
    seedRotationAngle += 10 // Rotate by 10 degrees every second
    if (seedRotationAngle >= 360) {
      seedRotationAngle = 0 // Reset after a full rotation
    }
    lastSeedRotationTime = currentTime // Update the last rotation time
  }

  ants.value.forEach(ant => {
    detectAndCollectSeeds(ant) // Check for nearby seeds
    updateAntPosition(ant) // Move ants, including those carrying seeds
  })

  // Calculate FPS
  const timeElapsed = currentTime - lastFpsUpdateTime
  if (timeElapsed >= 1000) {
    fps.value = (frameCount * 1000) / timeElapsed
    frameCount = 0
    lastFpsUpdateTime = currentTime
    totalFrameTime = 0
  }

  animationFrameId = requestAnimationFrame(drawAll)
}

// Watch for changes in antCount
watch(
  () => props.antCount,
  useThrottleFn((newCount) => {
    newCount = Math.round(newCount)

    const currentAntCount = ants.value.length
    const antsToAdd = Math.min(newCount - currentAntCount, maxAnts.value - currentAntCount)
    const antsToRemove = currentAntCount - newCount

    if (antsToAdd > 0) {
      addAnts(antsToAdd)
    } else if (antsToRemove > 0) {
      removeAnts(antsToRemove)
    }
  }, 1000), // Throttle to 1000ms
)

// Watch for changes in queenCount
watch(
  () => props.queenCount,
  useThrottleFn((newCount) => {
    newCount = Math.round(newCount)

    const currentQueenCount = queens.value.length
    const queensToAdd = Math.min(newCount - currentQueenCount, maxQueens.value - currentQueenCount)
    const queensToRemove = currentQueenCount - newCount

    if (queensToAdd > 0) {
      addQueens(queensToAdd)
    } else if (queensToRemove > 0) {
      removeQueens(queensToRemove)
    }
  }, 1000), // Throttle to 1000ms
)

// Watch for changes in eliteCount
watch(
  () => props.eliteCount,
  useThrottleFn((newCount) => {
    if (newCount === undefined) return

    newCount = Math.round(newCount)

    const currentEliteCount = eliteAnts.value.length
    const eliteAntsToAdd = Math.min(newCount - currentEliteCount, maxEliteAnts.value - currentEliteCount)
    const eliteAntsToRemove = currentEliteCount - newCount

    if (eliteAntsToAdd > 0) {
      addEliteAnts(eliteAntsToAdd)
    } else if (eliteAntsToRemove > 0) {
      removeEliteAnts(eliteAntsToRemove)
    }
  }, 1000), // Throttle to 1000ms
)

// Watch for changes in larvaeCount
watch(
  () => props.larvaeCount,
  useThrottleFn((newCount) => {
    newCount = Math.round(newCount)

    const currentLarvaeCount = larvae.value.length
    const larvaeToAdd = Math.min(newCount - currentLarvaeCount, maxLarvae.value - currentLarvaeCount)
    const larvaeToRemove = currentLarvaeCount - newCount

    if (larvaeToAdd > 0) {
      addLarvae(larvaeToAdd)
    } else if (larvaeToRemove > 0) {
      removeLarvae(larvaeToRemove)
    }
  }, 1000), // Throttle to 1000ms
)


onMounted(() => {
  if (canvas.value) {
    const dpr = window.devicePixelRatio || 1
    canvas.value.width = window.innerWidth * dpr
    canvas.value.height = window.innerHeight * dpr
    canvas.value.style.width = `${window.innerWidth}px`
    canvas.value.style.height = `${window.innerHeight}px`
    ctx.value = canvas.value.getContext('2d')
    if (ctx.value) {
      ctx.value.scale(dpr, dpr)
      lastFrameTime = performance.now()
      lastFpsUpdateTime = performance.now()

      createOffscreenBackground()

      animationFrameId = requestAnimationFrame(drawAll)

      // Add initial ants, queens, and larvae
      addAnts(props.antCount)
      addQueens(props.queenCount)
      addLarvae(props.larvaeCount)
      addEliteAnts(props.eliteCount || 0)
      updateVisualsForEvolution()

      setInterval(() => {
        if (seeds.value.length < 10)
          addSeed()
      }, 5000) // Add a new seed every 5 seconds (adjust as needed)
    }
  }

  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (canvas.value) {
    const previousCenterX = canvas.value.width / 2
    const previousCenterY = canvas.value.height / 2

    // Update the canvas size
    const dpr = window.devicePixelRatio || 1
    canvas.value.width = window.innerWidth * dpr
    canvas.value.height = window.innerHeight * dpr
    canvas.value.style.width = `${window.innerWidth}px`
    canvas.value.style.height = `${window.innerHeight}px`
    ctx.value?.scale(dpr, dpr)

    const newCenterX = canvas.value.width / 2
    const newCenterY = canvas.value.height / 2

    // Adjust positions of ants, queens, and larvae to maintain relative position around the new center
    ants.value.forEach((ant) => {
      ant.x += newCenterX - previousCenterX
      ant.y += newCenterY - previousCenterY
    })

    queens.value.forEach((queen) => {
      queen.x += newCenterX - previousCenterX
      queen.y += newCenterY - previousCenterY
    })

    larvae.value.forEach((larva) => {
      larva.x += newCenterX - previousCenterX
      larva.y += newCenterY - previousCenterY
    })

    ants.value = []
    queens.value = []
    larvae.value = []

    addAnts(props.antCount)
    addQueens(props.queenCount)
    addLarvae(props.larvaeCount)
    addEliteAnts(props.eliteCount || 0)
    createOffscreenBackground()
  }

  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
})

interface SeedEntity {
  id: number;
  x: number;
  y: number;
  collected: boolean; // To track whether the seed is already collected
}

const seeds = ref<SeedEntity[]>([])

const addSeed = () => {
  seeds.value.push({
    id: seeds.value.length,
    x: Math.random() * window.innerWidth, // Random X position
    y: Math.random() * window.innerHeight, // Random Y position
    collected: false, // Initially not collected
  })
}

const removeSeed = (id: number) => {
  seeds.value = seeds.value.filter(seed => seed.id !== id)
}

const detectAndCollectSeeds = (ant: AntEntity) => {
  seeds.value.forEach(seed => {
    if (!seed.collected && Math.abs(ant.x - seed.x) < 25 && Math.abs(ant.y - seed.y) < 25) {
      // If the ant is close to the seed, it collects it
      seed.collected = true
      ant.isCarryingSeed = true // New property for ants to track if they are carrying a seed
      ant.targetX = window.innerWidth / 2 // Set target to center
      ant.targetY = window.innerHeight / 2 // Set target to center
    }
  })
}

const updateAntPosition = (ant: AntEntity) => {
  if (ant.isCarryingSeed) {
    // Calculate the angle to the center (target)
    const angleToCenter = Math.atan2(window.innerHeight / 2 - ant.y, window.innerWidth / 2 - ant.x)

    // Calculate the difference between the current angle and the angle to the center
    let angleDifference = angleToCenter - (ant.angle * Math.PI) / 180

    // Normalize the angle difference to be between -PI and PI (to avoid large jumps)
    if (angleDifference > Math.PI) angleDifference -= 2 * Math.PI
    if (angleDifference < -Math.PI) angleDifference += 2 * Math.PI

    // Gradually adjust the ant's angle toward the center
    const adjustmentStrength = 0.02 // How quickly the ant adjusts toward the center
    ant.angle += angleDifference * adjustmentStrength * (180 / Math.PI) // Adjust the angle incrementally

    // Add a small random wandering effect
    ant.angle += (Math.random() - 0.5) * 5 // Adjust the value to control wandering randomness

    // Move the ant based on its current angle
    const radians = (ant.angle * Math.PI) / 180
    ant.x += Math.cos(radians) * ant.speed
    ant.y += Math.sin(radians) * ant.speed

    // Check if the ant has reached the center
    if (Math.abs(ant.x - window.innerWidth / 2) < 10 && Math.abs(ant.y - window.innerHeight / 2) < 10) {
      ant.isCarryingSeed = false
      removeSeed(ant.targetSeedId)
      // Optionally, add a point or resource to the game for successful delivery
    }
  }
}

const drawAntNest = () => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  // Save context state
  ctx.value!.save()

  // Draw the irregular dirt mound
  ctx.value!.beginPath()
  ctx.value!.moveTo(centerX - 70, centerY + 20) // Bottom-left
  ctx.value!.lineTo(centerX - 40, centerY - 40) // Up-left
  ctx.value!.lineTo(centerX + 40, centerY - 40) // Up-right
  ctx.value!.lineTo(centerX + 70, centerY + 20) // Bottom-right
  ctx.value!.closePath()
  ctx.value!.fillStyle = '#8B4513' // Brown dirt color
  ctx.value!.fill()

  // Add some shading to the mound for depth
  ctx.value!.beginPath()
  ctx.value!.moveTo(centerX - 70, centerY + 20)
  ctx.value!.lineTo(centerX - 40, centerY - 30)
  ctx.value!.lineTo(centerX + 40, centerY - 30)
  ctx.value!.lineTo(centerX + 70, centerY + 20)
  ctx.value!.fillStyle = '#A0522D' // Lighter brown for shading
  ctx.value!.fill()

  // Draw the tunnel entrance (small dark oval)
  ctx.value!.beginPath()
  ctx.value!.ellipse(centerX, centerY - 20, 15, 10, 0, 0, Math.PI * 2) // Oval hole
  ctx.value!.fillStyle = '#4B3621' // Dark brown for the tunnel entrance
  ctx.value!.fill()

  // Add shadow around the entrance for more depth
  ctx.value!.beginPath()
  ctx.value!.ellipse(centerX, centerY - 20, 18, 12, 0, 0, Math.PI * 2) // Larger oval for shadow
  ctx.value!.fillStyle = 'rgba(0, 0, 0, 0.2)' // Semi-transparent black
  ctx.value!.fill()

  // Scatter small pebbles around the nest
  const drawPebble = (x: number, y: number, size: number) => {
    ctx.value!.beginPath()
    ctx.value!.arc(x, y, size, 0, Math.PI * 2)
    ctx.value!.fillStyle = '#B0A596' // Gray for pebbles
    ctx.value!.fill()
  }
  drawPebble(centerX - 50, centerY + 30, 3) // Pebble 1
  drawPebble(centerX + 50, centerY + 30, 2) // Pebble 2
  drawPebble(centerX + 20, centerY + 40, 4) // Pebble 3
  drawPebble(centerX - 30, centerY + 45, 2) // Pebble 4

  // Restore context state after drawing
  ctx.value!.restore()
}


const {width, height} = useWindowSize()

const drawSeeds = () => {
  ctx.value!.fillStyle = '#928a42' // Yellow-green color for seeds

  seeds.value.forEach(seed => {
    if (!seed.collected) {
      ctx.value!.save()
      ctx.value!.translate(seed.x, seed.y) // Move to the seed's position
      ctx.value.rotate(seedRotationAngle * Math.PI / 180)

      ctx.value!.beginPath()
      // Draw the seed as a small oval, which looks more seed-like
      ctx.value!.ellipse(0, 0, 2, 4, 0, 0, Math.PI * 2) // Ellipse with width 3 and height 5
      ctx.value!.fill()

      ctx.value!.restore() // Restore the context to avoid affecting other drawings
    }
  })
}

// Create an offscreen canvas for the background
let offscreenCanvas: HTMLCanvasElement | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null

const createOffscreenBackground = () => {
  // Create the offscreen canvas
  offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = width.value
  offscreenCanvas.height = height.value
  offscreenCtx = offscreenCanvas.getContext('2d')

  if (!offscreenCtx) return

  const currentEvolution = evolveStore.currentEvolutionData // Get the current evolution

  switch (currentEvolution.name) {
    case 'Leaf cutters':
      // Draw a leafy green background
      offscreenCtx.fillStyle = '#2e8b57' // Dark green base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawLeafyPatches()
      createLeafObjects() // Draw scattered leaves
      break

    case 'Fire Ants':
      // Draw a fiery background
      offscreenCtx.fillStyle = '#ff4500' // Orange-red base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawAshPatches()
      createAshObjects() // Draw ash objects like burnt wood or rocks
      break

    case 'Harvester Ants':
      // Draw a desert-like background
      offscreenCtx.fillStyle = '#deb887' // Sandy brown base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawDesertPatches()
      createSeedObjects() // Draw scattered seeds
      break

    case 'Weaver Ants':
      // Draw a forest or tree background
      offscreenCtx.fillStyle = '#6b8e23' // Olive green base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawTreePatches()
      createNestObjects() // Draw tree branches or nests
      break

    case 'Desert Ants':
      offscreenCtx.fillStyle = '#8b4513' // Darker brown
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawDesertPatches()
      createCactusObjects() // Draw desert cacti or dry bushes
      break

    case 'Bullet Ants':
      offscreenCtx.fillStyle = '#2b2b2b' // Dark gray base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawJunglePatches()
      createJungleObjects() // Draw large leaves and jungle debris
      break

    case 'Army Ants':
      offscreenCtx.fillStyle = '#4e4e4e' // Dark earth color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawBattlefieldPatches()
      createBoneObjects() // Draw small bones or debris from battles
      break

    case 'Carpenter Ants':
      offscreenCtx.fillStyle = '#8b5a2b' // Brown wood base color
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawWoodPatches()
      createWoodObjects() // Draw wood chips or logs
      break

    default:
      offscreenCtx.fillStyle = '#c2b280' // Light tan color for base dirt
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      drawDefaultPatches()
      createSeedObjects() // Draw generic objects like stones
  }

  // Add shadowed areas for depth (applies to all backgrounds)
  const gradient = offscreenCtx.createRadialGradient(
    offscreenCanvas.width / 2,
    offscreenCanvas.height / 2,
    0,
    offscreenCanvas.width / 2,
    offscreenCanvas.height / 2,
    Math.max(offscreenCanvas.width, offscreenCanvas.height),
  )
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)')

  offscreenCtx.fillStyle = gradient
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
}

const createCactusObjects = () => {
  const cactusColors = ['#228b22', '#2e8b57', '#006400'] // Shades of green for cacti

  for (let i = 0; i < 15; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const cactusHeight = Math.random() * 30 + 20 // Random cactus height
    const cactusWidth = cactusHeight / 3 // Cacti are generally tall and narrow

    offscreenCtx.fillStyle = cactusColors[Math.floor(Math.random() * cactusColors.length)]

    // Draw the main stem of the cactus
    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.fillRect(-cactusWidth / 2, -cactusHeight, cactusWidth, cactusHeight)

    // Draw the arms of the cactus (two smaller rectangles)
    offscreenCtx.fillRect(-cactusWidth / 1.5, -cactusHeight * 0.7, cactusWidth / 2, cactusHeight / 2) // Left arm
    offscreenCtx.fillRect(cactusWidth / 2.5, -cactusHeight * 0.5, cactusWidth / 2, cactusHeight / 2) // Right arm

    offscreenCtx.restore()
  }
}

const createJungleObjects = () => {
  const jungleLeafColors = ['#006400', '#228B22', '#2E8B57'] // Dark green jungle leaves

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const leafLength = Math.random() * 50 + 30 // Random jungle leaf length
    const leafWidth = Math.random() * 20 + 10  // Random jungle leaf width

    offscreenCtx.fillStyle = jungleLeafColors[Math.floor(Math.random() * jungleLeafColors.length)]

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation
    offscreenCtx.beginPath()
    offscreenCtx.ellipse(0, 0, leafWidth, leafLength, 0, 0, Math.PI * 2) // Elliptical jungle leaf
    offscreenCtx.fill()
    offscreenCtx.restore()
  }

  // Add some vines or debris
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const vineLength = Math.random() * 100 + 50
    const vineThickness = Math.random() * 3 + 1

    offscreenCtx.fillStyle = '#3e8f4e' // Darker green for vines
    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation for vine
    offscreenCtx.fillRect(-vineThickness / 2, -vineLength / 2, vineThickness, vineLength)
    offscreenCtx.restore()
  }
}

const createBoneObjects = () => {
  const boneColors = ['#e0e0e0', '#dcdcdc', '#c0c0c0'] // Different shades of bone color

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const boneLength = Math.random() * 15 + 10 // Random bone size
    const boneThickness = Math.random() * 5 + 2 // Random bone thickness

    offscreenCtx.fillStyle = boneColors[Math.floor(Math.random() * boneColors.length)]

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation for bone

    // Draw the main shaft of the bone (rectangular part)
    offscreenCtx.fillRect(-boneLength / 2, -boneThickness / 2, boneLength, boneThickness)

    // Draw the rounded ends of the bone (ellipse for each end)
    offscreenCtx.beginPath()
    offscreenCtx.ellipse(-boneLength / 2, 0, boneThickness, boneThickness / 2, 0, 0, Math.PI * 2) // Left end
    offscreenCtx.ellipse(boneLength / 2, 0, boneThickness, boneThickness / 2, 0, 0, Math.PI * 2) // Right end
    offscreenCtx.fill()

    offscreenCtx.restore()
  }
}


const createLeafObjects = () => {
  const leafColors = ['#66bb66', '#4caf50', '#2e7d32'] // Shades of green
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const width = Math.random() * 20 + 10
    const height = Math.random() * 10 + 5
    offscreenCtx.fillStyle = leafColors[Math.floor(Math.random() * leafColors.length)]

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random leaf rotation
    offscreenCtx.beginPath()
    offscreenCtx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2) // Elliptical leaf shape
    offscreenCtx.fill()
    offscreenCtx.restore()
  }
}

const createAshObjects = () => {
  const ashColors = ['#d3d3d3', '#a9a9a9', '#696969'] // Shades of gray
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const size = Math.random() * 15 + 5
    offscreenCtx.fillStyle = ashColors[Math.floor(Math.random() * ashColors.length)]

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation
    offscreenCtx.fillRect(-size / 2, -size / 2, size, size) // Draw burnt rock/wood
    offscreenCtx.restore()
  }
}

const createSeedObjects = () => {
  const seedColors = ['#c4a484', '#a67b5b', '#8c6239'] // Shades of brown for seeds
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const size = Math.random() * 5 + 3 // Seed size
    offscreenCtx.fillStyle = seedColors[Math.floor(Math.random() * seedColors.length)]

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation
    offscreenCtx.beginPath()
    offscreenCtx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2) // Elliptical seed shape
    offscreenCtx.fill()
    offscreenCtx.restore()
  }
}


const createNestObjects = () => {
  offscreenCtx.fillStyle = '#8b4513' // Brown color for branches
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const width = Math.random() * 50 + 30
    const height = Math.random() * 15 + 10

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random branch rotation
    offscreenCtx.fillRect(-width / 2, -height / 2, width, height) // Draw branch/nest
    offscreenCtx.restore()
  }
}

const createWoodObjects = () => {
  const woodColors = ['#8b5a2b', '#a0522d', '#d2691e'] // Different shades of wood
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const width = Math.random() * 40 + 20
    const height = Math.random() * 10 + 5

    offscreenCtx.fillStyle = woodColors[Math.floor(Math.random() * woodColors.length)]
    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(Math.random() * Math.PI * 2) // Random rotation for logs/wood chips
    offscreenCtx.fillRect(-width / 2, -height / 2, width, height) // Draw log/wood chip
    offscreenCtx.restore()
  }
}


// Define additional functions to handle the specific patches based on evolution
const drawLeafyPatches = () => {
  // Logic for drawing green leafy patches
  // You can use similar drawing methods as your dirt patches, but adjust the color
  // Example:
  drawPatches('#66bb66', 15, 200, 120)
}

const drawAshPatches = () => {
  // Logic for drawing ash or burnt ground patches
  drawPatches('#a67c52', 10, 150, 100)
}

const drawDesertPatches = () => {
  // Logic for drawing desert-like patches
  drawPatches('#d2b48c', 15, 200, 150)
}

const drawTreePatches = () => {
  // Logic for drawing tree or branch-like patches
  drawPatches('#556b2f', 15, 180, 120)
}

const drawJunglePatches = () => {
  // Logic for drawing jungle patches
  drawPatches('#3e3e3e', 10, 150, 100)
}

const drawBattlefieldPatches = () => {
  // Logic for drawing battlefield patches
  drawPatches('#6e6e6e', 12, 180, 120)
}

const drawWoodPatches = () => {
  // Logic for drawing wood grain or bark-like patches
  drawPatches('#8b5a2b', 15, 200, 150)
}

const drawDefaultPatches = () => {
  // Logic for drawing default dirt patches
  drawPatches('#a67c52', 15, 200, 150)
}

// Utility function to draw irregular patches
const drawPatches = (color: string, numPatches: number, maxWidth: number, maxHeight: number) => {
  offscreenCtx.fillStyle = color
  for (let i = 0; i < numPatches; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const width = Math.random() * maxWidth + 50
    const height = Math.random() * maxHeight + 50
    offscreenCtx.beginPath()
    offscreenCtx.moveTo(x, y)
    offscreenCtx.lineTo(x + width * Math.random(), y + height * 0.6)
    offscreenCtx.lineTo(x + width * 0.8, y + height)
    offscreenCtx.lineTo(x + width * 0.4, y + height * Math.random())
    offscreenCtx.closePath()
    offscreenCtx.fill()
  }
}


// Function to draw the offscreen background onto the main canvas
const drawBackground = () => {
  if (offscreenCanvas && ctx.value) {
    ctx.value.drawImage(offscreenCanvas, 0, 0)
  }
}

const updateVisualsForEvolution = () => {
  const currentEvolution = evolveStore.currentEvolutionData // Get the current evolution

  switch (currentEvolution.name) {
    case 'Leaf cutters':
      ants.value.forEach(ant => ant.color = '#66bb66') // Green for leafcutters
      queens.value.forEach(queen => queen.color = '#66bb66')
      eliteAnts.value.forEach(elite => elite.color = '#66bb66')
      // createLeafBackground(); // Leafy green background
      break

    case 'Fire Ants':
      ants.value.forEach(ant => ant.color = '#e72e2e') // Red for fire ants
      queens.value.forEach(queen => queen.color = '#b22222')
      eliteAnts.value.forEach(elite => elite.color = '#b22222')
      // createFireBackground(); // Fiery background
      break

    case 'Harvester Ants':
      ants.value.forEach(ant => ant.color = '#8b4513') // Brown for harvester ants
      queens.value.forEach(queen => queen.color = '#5f370e')
      eliteAnts.value.forEach(elite => elite.color = '#5f370e')
      // createDesertBackground(); // Desert background
      break

    case 'Weaver Ants':
      ants.value.forEach(ant => ant.color = '#aaddaa') // Pale green for weaver ants
      queens.value.forEach(queen => queen.color = '#aaddaa')
      eliteAnts.value.forEach(elite => elite.color = '#aaddaa')
      // createTreeBackground(); // Tree branches background
      break

    case 'Desert Ants':
      ants.value.forEach(ant => ant.color = '#8b5113') // Brown for desert ants
      queens.value.forEach(queen => queen.color = '#5f370e')
      eliteAnts.value.forEach(elite => elite.color = '#5f370e')
      // createDesertBackground(); // Desert background
      break

    case 'Bullet Ants':
      ants.value.forEach(ant => ant.color = '#2e2b2b') // Dark gray for bullet ants
      queens.value.forEach(queen => queen.color = '#2e2b2b')
      eliteAnts.value.forEach(elite => elite.color = '#2e2b2b')
      // createJungleBackground(); // Jungle-like background
      break

    case 'Army Ants':
      ants.value.forEach(ant => ant.color = '#4e4e4e') // Gray for army ants
      queens.value.forEach(queen => queen.color = '#4e4e4e')
      eliteAnts.value.forEach(elite => elite.color = '#4e4e4e')
      // createArmyAntBackground(); // Army ant colony background
      break

    case 'Carpenter Ants':
      ants.value.forEach(ant => ant.color = '#4b3621') // Dark brown for carpenter ants
      queens.value.forEach(queen => queen.color = '#4b3621')
      eliteAnts.value.forEach(elite => elite.color = '#4b3621')
      // createWoodBackground(); // Wood/tree background
      break

    case 'Weaver Ants':
      ants.value.forEach(ant => ant.color = '#aaddaa') // Pale green for weaver ants
      queens.value.forEach(queen => queen.color = '#aaddaa')
      eliteAnts.value.forEach(elite => elite.color = '#aaddaa')
      // createTreeBackground(); // Weaver background
      break

    default:
      ants.value.forEach(ant => ant.color = '#4a4541') // Default color
      queens.value.forEach(queen => queen.color = '#383838')
      eliteAnts.value.forEach(elite => elite.color = '#383838')
    // createDefaultBackground(); // Default background
  }
}


watch(
  () => evolveStore.currentEvolutionData, // Watching for evolution changes
  () => {
    updateVisualsForEvolution() // Update visuals based on new evolution
  },
  {immediate: true}, // Trigger immediately on mount as well
)
</script>

<style scoped>
canvas {
  display: block;
}

div {
  z-index: 10;
}
</style>
