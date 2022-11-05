<template>
  <section>
    <section>
      <b-field grouped position="is-centered">
        <div :class="`${!esFadeOut ? 'fade-in' : 'fade-out'} contenedor-login`">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">Nuevo usuario</p>
            </header>
            <section class="modal-card-body">
              <b-field>
                <b-message
                  v-if="mostrarMensajeValidacion"
                  type="is-danger"
                  has-icon
                >
                  {{ mensajeValidacion }}
                </b-message>
              </b-field>
              <b-field label="Nombre">
                <b-input
                  v-model="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  validation-message="Solo caracteres alfabeticos"
                  pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$"
                >
                </b-input>
              </b-field>
              <b-field label="Email">
                <b-input
                  v-model="email"
                  type="email"
                  placeholder="Tu email"
                  required
                >
                </b-input>
              </b-field>

              <b-field label="Password">
                <b-input
                  v-model="password"
                  type="password"
                  password-reveal
                  placeholder="Tu contraseña"
                  required
                >
                </b-input>
              </b-field>
              <b-field label="Confirmación contraseña">
                <b-input
                  v-model="confirmPassword"
                  type="password"
                  password-reveal
                  placeholder="Tu contraseña"
                  required
                >
                </b-input>
              </b-field>
            </section>
            <footer class="modal-card-foot">
              <div class="columns">
                <div class="column">
                  <b-button
                    label="Crear"
                    type="is-primary"
                    @click="validaUsuario"
                  />
                </div>
                <div class="column">
                  <b-button label="Cancelar" @click="retornoLogin" />
                </div>
              </div>
            </footer>
          </div>
        </div>
      </b-field>
    </section>
    <section>
      <b-loading v-model="estaCargando" :is-full-page="false"></b-loading>
    </section>
  </section>
</template>

<script>
import { alerta } from '@/plugins/toast'
export default {
  data() {
    return {
      nombre: null,
      email: null,
      password: null,
      confirmPassword: null,
      esFadeOut: null,
      mensajeValidacion: null,
      mostrarMensajeValidacion: false,
      estaCargando: false,
    }
  },
  // created() {
  //   // eslint-disable-next-line no-unused-expressions
  //   this.crearUsuario()
  // },
  methods: {
    validaUsuario() {
      if (
        this.nombre === null ||
        this.email === null ||
        this.password === null ||
        this.confirmPassword === null
      ) {
        this.mostrarMensajeValidacion = true
        switch (true) {
          case this.nombre === null &&
            this.email !== null &&
            this.password !== null &&
            this.confirmPassword !== null:
            this.mensajeValidacion = 'Ingresar el campo nombre'
            break
          case this.email === null &&
            this.nombre !== null &&
            this.password !== null &&
            this.confirmPassword !== null:
            this.mensajeValidacion = 'Ingresar el campo email'
            break
          case this.password === null &&
            this.email !== null &&
            this.nombre !== null &&
            this.confirmPassword !== null:
            this.mensajeValidacion = 'La contraseña es requerida'
            break
          case this.confirmPassword === null &&
            this.email !== null &&
            this.nombre !== null &&
            this.password !== null:
            this.mensajeValidacion = 'La validacion de contraseña es requerida'
            break
          case this.password !== this.confirmPassword:
            this.mensajeValidacion = 'La contraseña no coinciden'
            break
          default:
            this.mensajeValidacion = 'Los campos se encuentran vacios'
            break
        }
      } else {
        this.crearUsuario()
      }
    },
    async crearUsuario() {
      this.estaCargando = true
      const contenido = {
        nombre: this.nombre,
        email: this.email,
        contraseña: this.password,
        estado: true,
      }
      const respuesta = await this.$api.Usuario.NuevoUsuario.post(contenido)
      if (!respuesta.data.exitoso) {
        alerta(3000, respuesta.data.mensaje, 'is-top', 'is-danger')
      } else {
        this.retornoLogin()
      }
      this.estaCargando = false
    },
    retornoLogin() {
      this.esFadeOut = true
      setTimeout(() => {
        this.$emit('retornoLogin', true)
      }, 2000)
    },
  },
}
</script>

<style scoped>
.contenedor-login {
  width: 500px;
  margin-top: 5%;
}
.span-izq {
  float: right;
}
.div-izq {
  text-align: right;
}
.fade-in {
  animation: fadeIn 2s;
  -webkit-animation: fadeIn 2s;
  -moz-animation: fadeIn 2s;
  -o-animation: fadeIn 2s;
  -ms-animation: fadeIn 2s;
}
.fade-out {
  animation: fadeOut ease 3s;
  -webkit-animation: fadeOut ease 3s;
  -moz-animation: fadeOut ease 3s;
  -o-animation: fadeOut ease 3s;
  -ms-animation: fadeOut ease 3s;
}
</style>
