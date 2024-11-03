<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
      <h2 class="text-lg font-bold mb-2">
        Privacy Policy
      </h2>

      <h3 class="font-semibold mt-4">
        1. Data We Collect
      </h3>
      <p class="mb-2">
        - **Sign-in Information**: We collect your email address or the credentials associated with the sign-in method you use (e.g., Google Sign-In). This is solely used for account authentication.
        <br>
        - **Game Data**: We collect data related to your progress in the game, such as in-game resources, achievements, and settings.
      </p>

      <h3 class="font-semibold mt-4">
        2. How We Use Your Data
      </h3>
      <p class="mb-2">
        - **Authentication**: Your email or sign-in credentials are used to verify your identity and allow you to access your game data.
        <br>
        - **Game Progress**: We use your game data to save progress and store settings.
        <br>
        - **Improvement of Services**: We may use anonymized data to analyze user interaction to improve the game experience.
      </p>

      <h3 class="font-semibold mt-4">
        3. Data Sharing
      </h3>
      <p class="mb-2">
        We do not share, sell, or rent your personal data to any third parties. However, we use third-party services for data storage and authentication, which are bound by confidentiality agreements.
        <br>
        **Example of services we use**:
        <br>
        - Firebase (Google) for authentication and data storage.
      </p>

      <h3 class="font-semibold mt-4">
        4. Your Rights
      </h3>
      <p class="mb-2">
        - **Access**: You can request access to your personal data at any time.
        <br>
        - **Deletion**: You can request that we delete your account and all associated data through the delete account feature in the settings.
        <br>
        - **Correction**: If your information is inaccurate, contact us to update it.
      </p>

      <h3 class="font-semibold mt-4">
        5. Data Retention
      </h3>
      <p class="mb-2">
        We retain your personal data for as long as your account is active. If you delete your account, we will delete your data promptly. Some data may remain in backup storage temporarily for legal purposes.
      </p>

      <h3 class="font-semibold mt-4">
        6. Data Security
      </h3>
      <p class="mb-2">
        We take data security seriously. All sensitive data, including sign-in credentials, are encrypted and stored securely to prevent unauthorized access.
      </p>

      <h3 class="font-semibold mt-4">
        7. Changes to This Privacy Policy
      </h3>
      <p class="mb-2">
        We may update this Privacy Policy to reflect changes in our practices. When updated, we will notify users by posting the new version in the game and updating the date at the top of this policy.
      </p>

      <h3 class="font-semibold mt-4">
        8. Contact Us
      </h3>
      <p class="mb-2">
        If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
        <br>
        **Email**: mezeman1@gmail.com
      </p>

      <div class="flex justify-between space-x-2 mt-6">
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          @click="cancel"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel'])

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* Add styling as needed for your modal */
</style>
