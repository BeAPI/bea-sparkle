<template>
  <section class="section section--main intro">
    <div class="container">
      <main class="intro__inner">
        <div class="intro__sidebar sidebar">
          <app-menu />
        </div>
        <article class="intro__content">
          <h1>Greetings in French</h1>
          <h2>Some shits with PIXI</h2>
          <h3>Seems to be the part 1</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vulputate, urna id luctus malesuada, 
            elit dolor tempor massa, dapibus laoreet magna urna ac urna. Sed ut diam a risus dignissim faucibus a non enim. 
            Sed quis turpis at mi elementum condimentum. Duis vulputate magna ut nisi porttitor, eu molestie nisl lobortis. 
            Aenean mattis dui non augue rutrum, et accumsan felis porttitor. Sed nisl augue, ultricies eu nunc eget, faucibus vestibulum nulla. 
            Vestibulum auctor urna et nunc commodo, id facilisis est porta. Mauris mi urna, interdum at posuere eget, pulvinar vel velit. 
            Praesent lacinia a mi a auctor. Duis porttitor pulvinar finibus.
          </p>
        </article>
      </main>
    </div>
  </section>
</template>

<script>
import AppMenu from '~/components/App/Menu.vue'

export default {
  components: {
    AppMenu
  }
}
</script>
