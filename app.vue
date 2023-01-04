<template>
  <VLocaleProvider>
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp>
      <NuxtPage />
    </VApp>
  </VLocaleProvider>
</template>

<style>
html,
body,
#__nuxt {
  margin: 0;
  height: 100%;
}

#__nuxt {
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>