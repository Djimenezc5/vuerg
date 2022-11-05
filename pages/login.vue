<template>
  <section>
    <section v-if="login">
      <login-usuario @UsuarioNuevo="creacionUsuario()"></login-usuario>
    </section>
    <section v-if="creacion">
      <!-- TODO: sección para crear un usuario -->
      <creacion-usuario @retornoLogin="ActivarLogin()"></creacion-usuario>
    </section>
    <section v-if="false">
      <!-- TODO: sección para recuperar una contraseña poca prioridad -->
      <h1>Recuperación de contraseña</h1>
    </section>
  </section>
</template>

<script>
import loginUsuario from '@/components/loginUsuario.vue'
import creacionUsuario from '@/components/creacionUsuario.vue'
export default {
  components: { loginUsuario, creacionUsuario },
  data() {
    return {
      login: true,
      creacion: false,
    }
  },
  methods: {
    creacionUsuario() {
      this.login = false
      this.creacion = true
    },
    ActivarLogin() {
      this.login = true
      this.creacion = false
    },
  },
}
</script>

<style></style>
