<template>
  <section class="section">
    <section>
      <b-carousel
        :progress="progress"
        progress-type="is-success"
        pause-info-type="is-success"
      >
        <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
          <section>
            <div class="contenedor obscurecer">
              <b-image :src="carousel.img" ratio="30by10"> </b-image>
              <div class="centrado">
                <h1 class="title color">Riegos de Guatemala</h1>
                <h3 class="subtitle color">
                  Administrador de sistema de riego
                </h3>
              </div>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </section>
    <br />
    <section>
      <componente-desplegable :titulo="'Grafica consumo'">
        <b-field style="padding: 2rem">
          <b-switch v-model="esTiempo">Tiempo de riego</b-switch>
        </b-field>
        <div class="columns">
          <div class="column"></div>
          <div class="column">
            <div class="contenedor-grafica column">
              <line-chart
                :title="tituloChart"
                :chart-options="chartOptions"
                :chart-data="chartData"
              ></line-chart>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </componente-desplegable>
    </section>
    <br />
    <section>
      <div class="columns is-multiline">
        <div v-for="(sector, index) in sectores" :key="index" class="tam-25">
          <template
            v-if="
              sector.ultimoHistorial !== null &&
              sector.ultimoHistorial.riegoActivo === true
            "
          >
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
          </template>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import Card from '~/components/Card'
import { mediciones } from '@/plugins/mediciones'
import { alerta } from '@/plugins/toast'
import ComponenteDesplegable from '@/components/ComponenteDesplegable.vue'
export default {
  components: {
    Card,
    ComponenteDesplegable,
  },
  data() {
    return {
      middleware: 'esAutenticado',
      progress: true,
      progressType: 'is-primary',
      humedad: null,
      luminosidad: null,
      sectores: [],
      carousels: [
        {
          img: 'https://images.pexels.com/photos/2684805/pexels-photo-2684805.jpeg',
        },
        {
          img: 'https://images.pexels.com/photos/4207906/pexels-photo-4207906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/11012604/pexels-photo-11012604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/6941503/pexels-photo-6941503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/5458354/pexels-photo-5458354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/4913531/pexels-photo-4913531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/5555232/pexels-photo-5555232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
          img: 'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
      ],
      chartData: {
        labels: [],
        datasets: [
          { label: 'Cantidad de agua', backgroundColor: '#f87979', data: [] },
        ],
      },
      chartOptions: {
        responsive: true,
      },
      tiempoRiego: [],
      cantidadAgua: [],
      esTiempo: false,
      tituloChart: '',
    }
  },
  watch: {
    humedad() {
      this.cambioMedicion()
    },
    esTiempo() {
      if (!this.esTiempo) {
        this.chartData.datasets[0].data = this.cantidadAgua
        this.chartData.datasets[0].label = 'Cantidad de agua'
        this.tituloChart = 'Agua'
      } else {
        this.chartData.datasets[0].data = this.tiempoRiego
        this.chartData.datasets[0].label = 'Tiempo de regado'
        this.tituloChart = 'Tiempo'
      }
    },
  },
  created() {
    this.obtieneSectores()
    this.obtieneMedidasSectores()
  },
  mounted() {
    this.intervalo()
  },
  methods: {
    intervalo() {
      mediciones(10, 50)
      window.setInterval(() => {
        this.humedad = localStorage.getItem('humedad')
        this.luminosidad = localStorage.getItem('luminosidad')
        this.obtieneMedidasSectores()
      }, 10000)
    },
    async obtieneSectores() {
      const respuesta = await this.$api.sectores.obtiebeSectores.get()
      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        this.sectores = respuesta.data.datos
      }
    },
    async obtieneMedidasSectores() {
      const respuesta = await this.$api.sectores.MedidasSectores.get()
      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        const sectores = []
        const valores = []
        this.tiempoRiego = []
        this.cantidadAgua = []
        respuesta.data.datos.forEach((sector) => {
          this.cantidadAgua.push(sector.catidaD_AGUA)
          this.tiempoRiego.push(sector.tiempO_RIEGO)
          sectores.push(sector.nombrE_SECTOR)
          !this.esTiempo
            ? valores.push(sector.catidaD_AGUA)
            : valores.push(sector.tiempO_RIEGO)
        })
        this.chartData.labels = sectores
        this.chartData.datasets[0].data = valores
      }
    },
    cambioMedicion() {
      this.sectores.forEach((sector) => {
        if (
          this.humedad <= sector.humedadMinima ||
          this.luminosidad <= sector.luminosidadMinima
        ) {
          this.IngresahistorialRiego(sector, 'Es inicio')
        } else if (
          this.humedad > sector.humedadMinima ||
          this.luminosidad > sector.humedadMaxima
        ) {
          this.IngresahistorialRiego(sector, 'Es fin')
        }
      })
    },

    IngresahistorialRiego(sector, tipo) {
      const datos = {
        IdSector: sector.id,
        tiempoRiego: 0,
        cantidadAgua: 0,
      }
      if (
        tipo === 'Es inicio' &&
        (sector.ultimoHistorial === null ||
          sector.ultimoHistorial.riegoActivo === false)
      ) {
        datos.RequiereNuevoHistorial = true
        datos.riegoActivo = true
        this.insertHitorial(datos)
      } else if (
        tipo === 'Es fin' &&
        sector.ultimoHistorial !== null &&
        sector.ultimoHistorial.riegoActivo === true
      ) {
        datos.RequiereNuevoHistorial = false
        datos.riegoActivo = false
        datos.codigoRiego = sector.ultimoHistorial.codigoRiego
        this.insertHitorial(datos)
      }
    },

    async insertHitorial(datos) {
      const respuesta = await this.$api.sectores.HistorialSensor.post(datos)
      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-success')
        this.obtieneSectores()
      }
    },
  },
}
</script>
<style scoped>
.contenedor {
  position: relative;
  text-align: center;
}
.centrado {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.color {
  color: whitesmoke;
}
.tam-25 {
  min-width: 25%;
  max-width: 100%;
}
.contenedor-grafica {
  max-height: 400px;
  max-width: 400px;
  padding: 25px;
}
</style>
