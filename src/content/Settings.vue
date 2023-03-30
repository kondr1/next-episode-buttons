<template>
    <Card class="fixed top-1/3 left-1/3 w-max h-max z-20" title="Настройки расширения" caption="рычажки и кнопочки">
      <span class="dark:text-white light:text-black mr-5"> 
        Сейчас установлена: {{ getCurrentTheme()?.name }}<br/>
        Автор: {{ getCurrentTheme()?.author }}<br/>
        <a :href="getCurrentTheme()?.url">{{ getCurrentTheme()?.url }}</a><br/>
      </span>
      <span class="text-white light:text-black mr-5">
          Тема: 
      </span>
      <Dropdown v-model="currentTheme" >
        <MenuItem v-for="t in themes" :value="`${t.name} by ${t.author}`" :key="t.name" />
      </Dropdown><br/>
      <span class="text-white light:text-black mr-5">
          За сколько секунд до конца серии начинать обратный отсчет:
      </span><br/>
      <input type="number" v-model="timeLeftLimit" /><br/>
      <span class="text-white light:text-black mr-5">
          Обратный отсчет в секундах:
      </span><br/>
      <input type="number" v-model="continueTimer" /><br/>
      <span class="text-white light:text-black mr-5">
        <input type="checkbox" v-model="continueAfterEnd" name="continueAfterEnd" />
        <label for="continueAfterEnd">Включать обратный остчет, когда видео кончилось полностью.</label>
      </span><br/>
      
    </Card>
</template>

<script lang="ts" setup>
    import { reactive, watch } from 'vue';
    import Card from './components/Card.vue';
    import Dropdown from './components/Dropdown.vue';
    import MenuItem from './components/MenuItem.vue';
    import settings, { Theme } from './settings'

    const { currentTheme, continueTimer, timeLeftLimit, continueAfterEnd } = settings
    const themes: Theme[] = reactive(settings.themes)

    watch(currentTheme, name => {
      const val = themes.find(x => `${x.name} by ${x.author}` === name);
      if (!val) return
      currentTheme.value = val.name
    })

    function getCurrentTheme(): Theme | undefined {
      return themes.find(x => x.name === currentTheme.value)
    }
</script>