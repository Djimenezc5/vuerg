<template>
  <section class="section">
    <section class="hero is-info">
      <div class="hero-body">
        <div v-if="!esInfo">
          <p class="title">Nuevo sector</p>
          <p class="subtitle">Creación de un nuevo <strong>sector</strong></p>
        </div>
        <div v-else>
          <p class="title">{{ sector.nombre }}</p>
          <p class="subtitle">Información del sector <strong>sector</strong></p>
        </div>
      </div>
    </section>

    <section>
      <b-field>
        <b-message v-if="mostrarMensajeValidacion" type="is-danger" has-icon>
          {{ mensajeValidacion }}
        </b-message>
      </b-field>
      <b-field
        :type="{ 'is-danger': esNombre }"
        class="tam-25"
        label="Nombre sector"
      >
        <b-input
          v-model="nombreSector"
          type="text"
          placeholder="Nombre del sector"
          required
          validation-message="Solo caracteres alfabeticos"
          pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$"
          :disabled="esDesactivado"
        >
        </b-input>
      </b-field>
      <b-field grouped label="Humedad sector">
        <b-field
          :type="{ 'is-danger': esHumedadMinima }"
          label="Humedad mínima"
          label-position="on-border"
        >
          <b-input
            v-model="humedadMinima"
            type="text"
            placeholder="min"
            required
            :disabled="esDesactivado"
          >
          </b-input>
        </b-field>
        <b-field
          :type="{ 'is-danger': esHumedadMaxima }"
          label="Humedad maxima"
          label-position="on-border"
        >
          <b-input
            v-model="humedadMaxima"
            type="text"
            placeholder="max"
            required
            :disabled="esDesactivado"
          >
          </b-input>
        </b-field>
      </b-field>
      <b-field grouped label="Luminosidad sector">
        <b-field
          :type="{ 'is-danger': esLuminosidadMinima }"
          label="Luminosidad mínima"
          label-position="on-border"
        >
          <b-input
            v-model="luminosidadMinima"
            type="text"
            placeholder="min"
            required
            :disabled="esDesactivado"
          >
          </b-input>
        </b-field>
        <b-field
          :type="{ 'is-danger': esLuminosidadMaxima }"
          label="Luminosidad maxima"
          label-position="on-border"
        >
          <b-input
            v-model="luminosidadMaxima"
            type="text"
            placeholder="max"
            required
            :disabled="esDesactivado"
          >
          </b-input>
        </b-field>
      </b-field>
      <div class="tam-25">
        <b-field label="Tiempo de riego">
          <b-field
            :type="{ 'is-danger': esTiempo }"
            label="Tiempo maximo de tiego"
            label-position="on-border"
          >
            <b-input
              v-model="tiempoMaximo"
              type="text"
              placeholder="Tiempo"
              required
              :disabled="esDesactivado"
            >
            </b-input>
          </b-field>
        </b-field>
      </div>
      <br />
      <b-field label="Descripcion">
        <b-field :type="{ 'is-danger': esDescripcion }">
          <b-input
            v-model="descripcion"
            maxlength="300"
            type="textarea"
            :disabled="esDesactivado"
          >
          </b-input>
        </b-field>
      </b-field>
      <div v-if="!esInfo" class="texto-izq">
        <b-button
          type="is-success"
          icon-left="content-save"
          @click="validacionCampos"
        ></b-button>
      </div>
    </section>
  </section>
</template>

<script>
import { alerta } from '@/plugins/toast'
export default {
  data() {
    return {
      middleware: 'esAutenticado',
      esInfo: null,
      emailUsuario: null,
      nombreSector: null,
      mostrarMensajeValidacion: false,
      expresionNumeroDecimal: /^\d{1,5}(\.\d{1,3})?$/,
      expresionNumero: /^\d{1,5}/,
      expresionRegularNombre:
        /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
      humedadMaxima: null,
      humedadMinima: null,
      luminosidadMaxima: null,
      luminosidadMinima: null,
      tiempoMaximo: null,
      descripcion: null,
      mensajeValidacion: '',
      esDesactivado: false,
      sector: null,
    }
  },
  computed: {
    esHumedadMaxima() {
      return !this.expresionNumeroDecimal.test(this.humedadMaxima)
    },
    esHumedadMinima() {
      return !this.expresionNumeroDecimal.test(this.humedadMinima)
    },
    esLuminosidadMaxima() {
      return !this.expresionNumeroDecimal.test(this.luminosidadMaxima)
    },
    esLuminosidadMinima() {
      return !this.expresionNumeroDecimal.test(this.luminosidadMinima)
    },
    esNombre() {
      return !this.nombreSector
    },
    esDescripcion() {
      return !this.descripcion
    },
    esTiempo() {
      return !this.expresionNumero.test(this.tiempoMaximo)
    },
  },
  created() {
    this.esInfo = this.$route.params.esInfo
    this.sector = this.$route.params.sector
    this.esDesactivado = this.$route.params.esInfo

    if (this.esDesactivado) {
      this.nombreSector = this.sector.nombre
      this.descripcion = this.sector.descripcionSector
      this.humedadMinima = this.sector.humedadMinima
      this.humedadMaxima = this.sector.humedadMaxima
      this.tiempoMaximo = this.sector.tiempoMaximoRiego
      this.luminosidadMinima = this.sector.luminosidadMinima
      this.luminosidadMaxima = this.sector.luminosidadMaxima
    }
  },
  mounted() {
    this.emailUsuario = localStorage.getItem('Usuario')
  },

  methods: {
    validacionCampos() {
      if (
        !this.esHumedadMaxima &&
        !this.esHumedadMinima &&
        !this.esNombre &&
        !this.esDescripcion &&
        !this.esTiempo &&
        !this.esLuminosidadMaxima &&
        !this.esLuminosidadMinima
      ) {
        this.guardar()
      } else {
        this.mostrarMensajeValidacion = true
        this.mensajeValidacion = 'Campos requeridos'
      }
    },
    async guardar() {
      const idUsuario = (this.idUsuario = localStorage.getItem('IdUsuario'))
      const datos = {
        Nombre: this.nombreSector,
        descripcionSector: this.descripcion,
        humedadMinima: parseFloat(this.humedadMinima),
        humedadMaxima: parseFloat(this.humedadMaxima),
        tiempoMaximoRiego: parseInt(this.tiempoMaximo, 10),
        luminosidadMinima: parseFloat(this.luminosidadMinima),
        luminosidadMaxima: parseFloat(this.luminosidadMaxima),
        UsuarioCreacion: idUsuario,
      }
      const respuesta = await this.$api.sectores.NuevoSector.post(datos)
      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-success')
        this.$router.push('/sectores')
      }
    },
  },
}
</script>

<style scoped>
.tam-25 {
  max-width: 26.5em;
}
.texto-izq {
  text-align: right;
}
</style>
