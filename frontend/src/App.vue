<template>
  <div id="app">
    <Header />
    <Menu :signin="signin" />
    <Loading v-if="validatingToken" />
    <Content v-else/>
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "./components/template/Header";
import Menu from "./components/template/Menu";
import Content from "./components/template/Content";
import Footer from "./components/template/Footer";
import Loading from "./components/template/Loading";
import axios from "axios";
import { baseApiUrl, userKey } from "@/global";

export default {
  components: { Header, Menu, Content, Footer, Loading },
  computed: mapState(["loading"]),
  data: function() {
    return {
      validatingToken: true,
      signin: false
    };
  },
  methods: {
    async validateToken() {
      this.validatingToken = true;
      this.signin = false;

      const json = localStorage.getItem(userKey);
      const userData = JSON.parse(json);
      this.$store.commit("setUser", null);

      if (!userData) {
        this.validatingToken = false;
        this.signin = false;
        this.$router.push({ name: "auth" });
        return;
      }
      const res = await axios.post(`${baseApiUrl}/validate`, userData);

      if (res.data) {
        this.$store.commit("setUser", userData);
        this.signin = true;
      } else {
        localStorage.removeItem(userKey);
        this.signin = false;
        this.$router.push({ name: "auth" });
        
      }

      this.validatingToken = false;

    }
  },
   created() {
     this.validateToken();
  }
};
</script>

<style>
@font-face {
  font-family: "Raleway-Thin";
  src: url("./fonts/Raleway-Thin.ttf");
}

* {
  padding: 0;
  margin: 0;
  font-family: "Times New Roman", "monospace", "serif";
}

#app {
  height: 100vh;
  display: grid;
  grid-template-rows: 40px 60px 1fr 30px;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "menu" "content" "footer";
}
</style>
