<template>
  <section class="section">
    <section class="hero is-info">
      <div class="hero-body">
        <p class="title">{{ tipoSensor.nombreTipoSensor }}</p>
        <p class="subtitle">
          {{ tipoSensor.descripcionTipoSensor }}
        </p>
      </div>
    </section>
    <br />
    <section>
      <div v-for="(sector, index) in sectores" :key="index">
        <componente-desplegable
          :titulo="sector.nombre"
          :codigo-desplegable="sector.nombre"
          :desplegable-abierto="SeccionAbierta"
          @clikDesplegable="abrirDesplegable($event)"
        >
          <div class="card-content">
            <div class="content">
              <b-table :data="filtraSensores(sector.id)">
                <b-table-column
                  v-slot="props"
                  field="idSensor"
                  label="ID sensor"
                >
                  {{ props.row.idSensor }}
                </b-table-column>

                <b-table-column
                  v-slot="props"
                  field="codigoSensor"
                  label="Codigo de sensor"
                >
                  {{ props.row.codigoSensor }}
                </b-table-column>
                <b-table-column v-slot="props">
                  <b-button
                    type="is-danger"
                    icon-left="delete"
                    @click="eliminarSensor(props.row)"
                  ></b-button>
                </b-table-column>
              </b-table>
            </div>
          </div>
          <footer class="pie-desplegable">
            <div class="margin-15px text-iqz">
              <b-button
                type="is-info"
                icon-left="plus-circle"
                title="Nuevo sector"
                @click="creaNuevoSensor(sector.id)"
              >
                Nuevo sensor
              </b-button>
            </div>
          </footer>
        </componente-desplegable>
      </div>
    </section>
  </section>
</template>

<script>
import ComponenteDesplegable from '@/components/ComponenteDesplegable'
import { alerta } from '@/plugins/toast'
import { mediciones, medicionSensores } from '@/plugins/mediciones'
export default {
  components: {
    ComponenteDesplegable,
  },
  data() {
    return {
      middleware: 'esAutenticado',
      idUsuario: 0,
      tipoSensor: {},
      sectores: [],
      esActivo: false,
      tipoSector: null,
      SeccionAbierta: null,
      sensores: [],
      humedad: null,
      luminosidad: null,
    }
  },
  watch: {
    humedad() {
      if (this.tipoSensor.id === 1 && this.sensores.length > 0) {
        this.cambioMedicion()
      }
    },

    luminosidad() {
      if (this.tipoSensor.id === 2 && this.sensores.length > 0) {
        this.cambioMedicion()
      }
    },
  },
  created() {
    this.tipoSensor = this.$route.params.tipo
    this.obtieneSensores()
    this.obtieneSectores()
    this.intervalo()
  },
  mounted() {
    this.idUsuario = localStorage.getItem('IdUsuario')
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
    validaCreacion() {
      if (this.tipoSector === null) {
        alerta(3000, 'Se debe de seleccionar un sector', 'is-top', 'is-danger')
      } else {
        this.creaNuevoSensor()
      }
    },
    async creaNuevoSensor(idSectorSeccion) {
      const payload = {
        IdTipoSensor: this.tipoSensor.id,
        idSector: idSectorSeccion,
        idUsarioCreacion: this.idUsuario,
      }
      const respuesta = await this.$api.sensores.NuevoSensor.post(payload)

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        alerta(3000, 'Sensor creado exitosamente', 'is-top', 'is-success')
        this.obtieneSensores()
      }
    },
    abrirDesplegable(Tipo) {
      this.SeccionAbierta === Tipo
        ? (this.SeccionAbierta = null)
        : (this.SeccionAbierta = Tipo)
    },
    async obtieneSensores() {
      const respuesta = await this.$api.sensores.obtieneSensores.get(
        `?tipoSensor=${this.tipoSensor.id}`
      )

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        this.sensores = respuesta.data.datos
      }
    },
    filtraSensores(idSector) {
      const sensoresTabla = this.sensores.filter(
        (sensor) => sensor.idSector === idSector
      )
      return sensoresTabla
    },
    async eliminarSensor(sensor) {
      const respuesta = await this.$api.sensores.BajaSensor.put(
        `?idSensor=${sensor.idSensor}`
      )

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-success')
        this.obtieneSensores()
      }
    },

    intervalo() {
      const validaHumendad = localStorage.getItem('humedad')
      if (validaHumendad == null) {
        mediciones(10, 50)
      }
      window.setInterval(() => {
        this.humedad = localStorage.getItem('humedad')
        this.luminosidad = localStorage.getItem('luminosidad')
      }, 10000)
    },
    cambioMedicion() {
      let medicion = 0
      this.sensores.forEach((sensor) => {
        if (this.tipoSensor.id === 1) {
          const maxHumedad = parseFloat(this.humedad) + 2
          const minHumedad = this.humedad - 2
          medicion = medicionSensores(minHumedad, maxHumedad)
        } else if (this.tipoSensor.id === 2) {
          const maxLuminosidad = parseFloat(this.luminosidad) + 2
          const minLuminosidad = parseFloat(this.luminosidad) - 2
          medicion = medicionSensores(minLuminosidad, maxLuminosidad)
        }
        const datos = {
          idSensor: sensor.idSensor,
          medidaSensor: medicion,
        }
        this.insertHistorial(datos)
      })
    },

    async insertHistorial(datos) {
      const respuesta = await this.$api.sensores.HostorialSensor.post(datos)

      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-success')
        this.obtieneSensores()
      }
    },
  },
}
</script>

<style scoped>
.pie-desplegable {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: 1px solid #dbdbdb;
  background-color: whitesmoke;
}
.margin-15px {
  padding: 15px;
}
.text-iqz {
  text-align: right;
}
</style>
