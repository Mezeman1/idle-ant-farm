<template>
  <div>
    <canvas
      ref="canvas"
      class="w-full h-screen"
    />
    <div
      v-if="debugMode"
      class="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg"
    >
      <p>Ants: {{ ants.length }} Max: {{ maxAnts }}</p>
      <p>Queens: {{ queens.length }} Max: {{ maxQueens }}</p>
      <p>Larvae: {{ larvae.length }} Max: {{ maxLarvae }}</p>
      <p>FPS: {{ fps.toFixed(1) }}</p>
      <p class="mb-2">
        Average Frame Time: {{ avgFrameTime.toFixed(2) }} ms
      </p>

      <p class="text-2xs">
        Note:
        <br>
        The number of entities above is limited to prevent performance issues.
        <br>
        These numbers have been optimized for performance.
        <br>
        These maxes have nothing to do with the actual game.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = defineProps<{
  antCount: number;
  queenCount: number;
  larvaeCount: number;
}>()

const debugMode = import.meta.env.MODE === 'localhost'

interface AntEntity {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: { width: number; height: number };
  type: 'ant' | 'queen';
  isPaused: boolean;
  pauseTimer: number;
  hasInteracted: boolean;
  color: string;
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
    if (entity.type === 'ant') {
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

// Draw background
const drawBackground = () => {
  ctx.value!.fillStyle = '#dcdcdc' // Dark Slate Gray
  ctx.value!.fillRect(0, 0, canvas.value!.width, canvas.value!.height) // Fill the whole canvas
}

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

  // Draw the background
  drawBackground()

  // Draw all entities
  drawLarvae()
  drawEntities(ants.value)
  drawEntities(queens.value)

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
      animationFrameId = requestAnimationFrame(drawAll)

      // Add initial ants, queens, and larvae
      addAnts(props.antCount)
      addQueens(props.queenCount)
      addLarvae(props.larvaeCount)
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
  }

  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
canvas {
  display: block;
}

div {
  z-index: 10;
}
</style>
