<template>
  <section>
    <section>
      <b-collapse
        class="card"
        animation="slide"
        aria-id="contentIdForA11y3"
        :open="abierto()"
        @open="TipoDesplegable"
        @close="TipoDesplegable"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">{{ titulo }}</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <slot />
      </b-collapse>
    </section>
  </section>
</template>

<script>
export default {
  props: {
    titulo: { type: String, default: 'Titulo desplegable' },
    codigoDesplegable: { type: String, default: '' },
    desplegableAbierto: { type: String, default: null },
  },
  data() {
    return {
      bandera: this.desplegableAbierto,
    }
  },
  methods: {
    TipoDesplegable() {
      this.$emit('clikDesplegable', this.codigoDesplegable)
    },
    abierto() {
      if (this.desplegableAbierto === this.codigoDesplegable) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style></style>
