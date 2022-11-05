<template>
  <section>
    <section>
      <b-field grouped position="is-centered">
        <div :class="`${!esFadeOut ? 'fade-in' : 'fade-out'} contenedor-login`">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">
                Login
                <span class="span-izq"
                  ><b-button
                    icon-left="account-plus"
                    title="Nuevo usuario"
                    @click="creacionUsuario"
                  ></b-button
                ></span>
              </p>
            </header>
            <section class="modal-card-body">
              <b-field label="Email">
                <b-input
                  v-model="email"
                  type="email"
                  placeholder="Your email"
                  required
                >
                </b-input>
              </b-field>

              <b-field label="Password">
                <b-input
                  v-model="password"
                  type="password"
                  password-reveal
                  placeholder="Your password"
                  required
                >
                </b-input>
              </b-field>
            </section>
            <footer class="modal-card-foot">
              <b-button
                label="Login"
                type="is-primary"
                @click="validaUsuario"
              />
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
      email: null,
      password: null,
      esFadeOut: null,
      estaCargando: false,
    }
  },
  methods: {
    validaUsuario() {
      if (this.email === null || this.password === null) {
        alerta(3000, 'Ingresar los campos requeridos', 'is-top', 'is-danger')
      } else {
        this.loginUsuario()
      }
    },
    creacionUsuario() {
      this.esFadeOut = true
      setTimeout(() => {
        this.$emit('UsuarioNuevo', true)
      }, 2000)
    },
    async loginUsuario() {
      this.estaCargando = true
      const payload = {
        email: this.email,
        contrasenia: this.password,
      }
      try {
        const login = await this.$auth.loginWith('local', {
          data: payload,
        })
        localStorage.setItem('Usuario', login.data.datos.email)
        localStorage.setItem('IdUsuario', login.data.datos.id)
        return { to: { name: 'index' } }
      } catch (error) {
        alerta(3000, error.response.data.mensaje, 'is-top', 'is-danger')
        this.estaCargando = false
      }

      this.estaCargando = false
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
