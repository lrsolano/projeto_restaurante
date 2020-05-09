<template>
  <div class="login">
      <b-card class="login-card">
        <b-card-header class="login-header">
          <div class="text-center">Login</div>
        </b-card-header>
        <b-card-body>
          <div>
            <input type="text" v-model="user.user" placeholder="Digite seu login..." name="login" />
            <input
              type="password"
              v-model="user.password"
              placeholder="Digite sua senha..."
              name="password"
            />
            <b-button pill variant="primary" class="button-login" @click="signin">Logar</b-button>
          </div>
        </b-card-body>
        <b-card-footer></b-card-footer>
      </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError, userKey } from "@/global";
import { mapState } from "vuex";
export default {
  computed: mapState(['loading']),
  name: "Auth",
  data: function() {
    return {
      user: {},
    };
  },
  methods: {
    async signin() {
      this.$store.commit("setLoading",true);
      await axios
        .post(`${baseApiUrl}/login`, this.user)
        .then(res => {
          this.$store.commit("setUser", res.data);
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.$router.push({ path: "/" });
        })
        .catch(showError);
      this.$store.commit("setLoading",false);
    }
  },
  created() {
    const json = localStorage.getItem(userKey);
    const userData = JSON.parse(json);
    if (userData) {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: rgba(98, 118, 46, 0.3);
}

.login-header {
  background: linear-gradient(
    to right,
    rgba(55, 105, 41, 0.5),
    rgba(116, 165, 103, 0.6)
  );
  border-bottom: 2px solid #528544;
}
.login input {
  display: block;
  margin-top: 15px;
  padding: 4px;
  font-size: 1.1rem;
  outline: none;
}
.login .button-login {
  margin-top: 15px;
  padding: 5px;
  width: 100px;
}
</style>