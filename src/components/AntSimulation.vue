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

const props = defineProps<{
  antCount: number;
  queenCount: number;
  larvaeCount: number;
  eliteCount?: number;
}>()

const debugMode = import.meta.env.MODE === 'localhost'

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
  return Math.min(5000, Math.floor(screenWidth.value * 2))
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
  const antsToAdd = Math.min(count, maxAnts.value - ants.value.length)

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
  drawEntities(ants.value)
  drawEntities(queens.value)
  drawEntities(eliteAnts.value)
  drawSeeds() // Draw seeds only once every second

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
  (newCount) => {
    newCount = Math.round(newCount)

    const currentAntCount = ants.value.length
    const antsToAdd = Math.min(newCount - currentAntCount, maxAnts.value - currentAntCount)
    const antsToRemove = currentAntCount - newCount

    if (antsToAdd > 0) {
      addAnts(antsToAdd)
    } else if (antsToRemove > 0) {
      removeAnts(antsToRemove)
    }
  },
)

// Watch for changes in queenCount
watch(
  () => props.queenCount,
  (newCount) => {
    newCount = Math.round(newCount)

    const currentQueenCount = queens.value.length
    const queensToAdd = Math.min(newCount - currentQueenCount, maxQueens.value - currentQueenCount)
    const queensToRemove = currentQueenCount - newCount

    if (queensToAdd > 0) {
      addQueens(queensToAdd)
    } else if (queensToRemove > 0) {
      removeQueens(queensToRemove)
    }
  },
)

watch(
  () => props.eliteCount,
  (newCount) => {
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
  },
)

// Watch for changes in larvaeCount
watch(
  () => props.larvaeCount,
  (newCount) => {
    newCount = Math.round(newCount)

    const currentLarvaeCount = larvae.value.length
    const larvaeToAdd = Math.min(newCount - currentLarvaeCount, maxLarvae.value - currentLarvaeCount)
    const larvaeToRemove = currentLarvaeCount - newCount

    if (larvaeToAdd > 0) {
      addLarvae(larvaeToAdd)
    } else if (larvaeToRemove > 0) {
      removeLarvae(larvaeToRemove)
    }
  },
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


const { width, height } = useWindowSize()

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

  // Draw the main dirt background
  offscreenCtx.fillStyle = '#c2b280' // Light tan color for base dirt
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)

  // Draw irregular dirt patches (bigger, less frequent)
  const drawDirtPatch = (x: number, y: number, width: number, height: number) => {
    offscreenCtx.beginPath()
    offscreenCtx.moveTo(x, y)
    offscreenCtx.lineTo(x + width * Math.random(), y + height * 0.6)
    offscreenCtx.lineTo(x + width * 0.8, y + height)
    offscreenCtx.lineTo(x + width * 0.4, y + height * Math.random())
    offscreenCtx.closePath()
    offscreenCtx.fillStyle = '#a67c52' // Darker brown for dirt patches
    offscreenCtx.fill()
  }

  // Reduce the frequency of dirt patches but make them bigger
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const width = Math.random() * 200 + 150
    const height = Math.random() * 120 + 80
    drawDirtPatch(x, y, width, height)
  }

  // Draw small pebbles (irregular shapes)
  const drawPebble = (x: number, y: number, size: number) => {
    offscreenCtx.beginPath()
    const angleOffset = Math.random() * Math.PI * 2 // Randomize angle offset to make the pebble irregular
    offscreenCtx.ellipse(x, y, size * 1.2, size * 0.8, angleOffset, 0, Math.PI * 2)
    offscreenCtx.fillStyle = '#8B8B7A' // Gray color for stones
    offscreenCtx.fill()
  }

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    const size = Math.random() * 4 + 1 // Slightly larger and less frequent pebbles
    drawPebble(x, y, size)
  }

  // Draw realistic grass patches
  const drawGrassPatch = (x: number, y: number, blades: number) => {
    offscreenCtx.fillStyle = '#006400' // Dark green grass color
    for (let i = 0; i < blades; i++) {
      const bladeHeight = Math.random() * 12 + 8 // Grass blade height
      const bladeWidth = Math.random() * 2 + 1 // Grass blade thickness
      const angle = Math.random() * 0.4 - 0.2 // Slight angle variation for natural look

      offscreenCtx.save()
      offscreenCtx.translate(x, y)
      offscreenCtx.rotate(angle) // Slightly tilt the grass blades
      offscreenCtx.fillRect(-bladeWidth / 2, 0, bladeWidth, -bladeHeight)
      offscreenCtx.restore()
    }
  }

  for (let i = 0; i < 50; i++) {
    const x = Math.random() * offscreenCanvas.width
    const y = Math.random() * offscreenCanvas.height
    drawGrassPatch(x, y, Math.floor(Math.random() * 5 + 3)) // Each patch has 3-7 grass blades
  }

  // Add some shadowed areas to simulate depth
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

// Function to draw the offscreen background onto the main canvas
const drawBackground = () => {
  if (offscreenCanvas && ctx.value) {
    ctx.value.drawImage(offscreenCanvas, 0, 0)
  }
}
</script>

<style scoped>
canvas {
  display: block;
}

div {
  z-index: 10;
}
</style>
