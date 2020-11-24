<template>
  <div>
    <h1>Convert Logic Apps to PlantUML</h1>
    <form role="form" class="form">
      <div class="form-group">
        <textarea
          class="form-control"
          name="logicapp"
          v-model="logicapp"
          placeholder="Paste logic app here"
        ></textarea>
      </div>
    </form>
    <img id="im" v-bind:src="imgurl"/>
    <pre>{{ plantuml }}</pre>
  </div>
</template>
<style lang="scss">
img {
}
</style>
<script>
import logic2puml from 'logic-app-to-plantuml';
import deflate from 'deflate-js';

const $ = function (id) {
  return document.getElementById(id);
};

function encode64(data) {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 == data.length) {
      r += append3bytes(data[i], data[i + 1], 0);
    } else if (i + 1 == data.length) {
      r += append3bytes(data[i], 0, 0);
    } else {
      r += append3bytes(
        data[i],
        data[i+1],
        data[i+2]
      );
    }
  }
  return r;
}

function append3bytes(b1, b2, b3) {
  let c1 = b1 >> 2;
  let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  let c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  let c4 = b3 & 0x3f;
  let r = "";
  r += encode6bit(c1 & 0x3f);
  r += encode6bit(c2 & 0x3f);
  r += encode6bit(c3 & 0x3f);
  r += encode6bit(c4 & 0x3f);
  return r;
}

function encode6bit(b) {
  if (b < 10) {
    return String.fromCharCode(48 + b);
  }
  b -= 10;
  if (b < 26) {
    return String.fromCharCode(65 + b);
  }
  b -= 26;
  if (b < 26) {
    return String.fromCharCode(97 + b);
  }
  b -= 26;
  if (b == 0) {
    return "-";
  }
  if (b == 1) {
    return "_";
  }
  return "?";
}

function compress(s) {
  //UTF8
  s = unescape(encodeURIComponent(s));
  let bytes = Array.prototype.map.call(s, c => c.charCodeAt(0));
  let deflated = deflate.deflate(bytes);
  let encoded = encode64(deflated);
  return "http://www.plantuml.com/plantuml/svg/" + encoded;
}

export default {
  name: "App",
  data: function () {
    return {
      message: "Hello world!",
      logicapp: "",
      plantuml: "",
      imgurl: ""
    };
  },
  watch: {
    logicapp() {
      let plantuml = logic2puml.convert(this.logicapp);
      let url = compress(plantuml);
      this.imgurl = url;
      this.plantuml = plantuml;
    },
  },
  mounted() {
    console.log("App mounted");
  },
};
</script>