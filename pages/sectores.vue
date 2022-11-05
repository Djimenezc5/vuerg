<template>
  <section class="section">
    <section>
      <section class="hero is-success">
        <div class="hero-body">
          <p class="title">
            Sectores
            <span class="span-flotante-izq">
              <NuxtLink
                :to="{
                  name: 'infoSector',
                  params: { esInfo: false, idSector: 0, nombreSector: '' },
                }"
              >
                <b-button
                  type="is-info"
                  icon-left="plus-circle"
                  title="Nuevo sector"
                ></b-button>
              </NuxtLink>
            </span>
          </p>
          <p class="subtitle">
            Modulo para administración de <strong>sectores</strong> Riegos de
            Guatemala
          </p>
        </div>
      </section>
      <br />

      <section>
        <div class="columns is-multiline">
          <div v-for="(sector, index) in sectores" :key="index" class="tam-25">
            <NuxtLink
              :to="{
                name: 'infoSector',
                params: {
                  esInfo: true,
                  sector: sector,
                },
              }"
            >
              <card :title="sector.nombre" icon="arrange-bring-to-front">
                {{ sector.descripcionSector }}
              </card>
            </NuxtLink>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import Card from '@/components/Card.vue'
import { alerta } from '@/plugins/toast'
export default {
  components: { Card },
  data() {
    return {
      middleware: 'esAutenticado',
      sectores: [],
    }
  },
  created() {
    this.obtieneSectores()
  },
  methods: {
    async obtieneSectores() {
      const respuesta = await this.$api.sectores.obtiebeSectores.get()

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        this.sectores = respuesta.data.datos
      }
    },
  },
}
</script>

<style scoped>
.tam-25 {
  min-width: 25%;
  max-width: 100%;
}
.span-flotante-izq {
  float: right;
}
</style>
