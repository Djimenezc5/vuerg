<template>
  <section class="section">
    <section class="hero is-success">
      <div class="hero-body">
        <p class="title">Sensores</p>
        <p class="subtitle">
          Modulo para administración de <strong>sensores</strong> Riegos de
          Guatemala
        </p>
      </div>
    </section>
    <br />
    <section>
      <div v-for="(tipoSensor, index) in TipoSendores" :key="index">
        <NuxtLink :to="{ name: 'sensores', params: { tipo: tipoSensor } }">
          <card :title="tipoSensor.nombreTipoSensor" :icon="tipoSensor.icono">
            {{ tipoSensor.descripcionTipoSensor }}
          </card>
        </NuxtLink>
      </div>
    </section>
  </section>
</template>

<script>
import Card from '@/components/Card'
import { alerta } from '@/plugins/toast'
export default {
  components: { Card },
  data() {
    return {
      middleware: 'esAutenticado',
      TipoSendores: [],
    }
  },
  created() {
    this.obtieneTipoSensor()
  },
  methods: {
    async obtieneTipoSensor() {
      const respuesta = await this.$api.sensores.ObtieneTipoSensor.get()

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        this.TipoSendores = respuesta.data.datos
      }
    },
  },
}
</script>

<style></style>
