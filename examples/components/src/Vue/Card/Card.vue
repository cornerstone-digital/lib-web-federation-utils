<template>
  <div class="vue-card">
    <div class="vue-card-header">
      <slot name="vue-header">
        <h3 class="vue-card-title">Card</h3>
      </slot>
    </div>
    <div class="vue-card-body">
      <slot>
        <p>
          I'm a card block created in Vue. Click on the edit button to change
          this text.
        </p>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style>
.vue-card {
  margin-top: 1.5rem;
  margin-left: 1.5rem;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
  overflow: hidden;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
}
.vue-card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}
.vue-card-header h3 {
  margin-bottom: 0;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.5;
}
.vue-card-body {
  padding: 1.25rem 1.5rem;
}
.vue-card-body p {
  margin-bottom: 1.25rem;
}
</style>
