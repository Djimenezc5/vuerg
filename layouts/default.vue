<template>
  <div>
    <nav
      class="navbar is-success"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <NuxtLink :to="{ name: 'index' }">
          <img src="~assets/img/Riegos Gt.png" style="max-width: 4rem" />
        </NuxtLink>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <span v-if="$auth.loggedIn">{{ usuario }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="main-content columns">
      <aside v-if="$auth.loggedIn" class="column is-2 section">
        <div>
          <p class="menu-label is-hidden-touch">Menu</p>
          <ul class="menu-list">
            <li v-for="(item, key) of items" :key="key">
              <NuxtLink :to="item.to" exact-active-class="back-active">
                <b-icon :icon="item.icon" /> {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div v-if="$auth.loggedIn">
          <p class="menu-label is-hidden-touch">Acciones</p>
          <ul class="menu-list">
            <div @click="salir">
              <b-icon icon="logout" />
              Salir
            </div>
          </ul>
        </div>
      </aside>
      <div class="container column is-10">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      middleware: 'esAutenticado',
      usuario: '',
      items: [
        {
          title: 'Inicio',
          icon: 'home',
          to: { name: 'index' },
        },
        {
          title: 'Sector',
          icon: 'vector-intersection',
          to: { name: 'sectores' },
        },
        {
          title: 'Sensores',
          icon: 'weather-partly-rainy',
          to: { name: 'TipoSensores' },
        },
      ],
    }
  },
  mounted() {
    this.usuario = localStorage.getItem('Usuario')
  },
  methods: {
    async salir() {
      await this.$auth.logout()
      await this.$auth.$storage.removeUniversal('user')
      localStorage.clear()
      location.reload()
    },
  },
}
</script>
<style scoped>
.back-active {
  background-color: #48c78e;
  color: #fff;
}
</style>
