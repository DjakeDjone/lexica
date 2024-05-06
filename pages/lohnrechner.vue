<script setup lang="ts">
import { type LstDataOut, calcLohnabrechnung, type LstDataIn } from '~/model/lohnsteuer';


const data = ref<LstDataIn>({
    brutto: 1000,
    fabo: false,
    fabo_voll: false,
    avabae: false,
    minderj_kinder: 0,
    vollj_kinder: 0
})

const result = ref<LstDataOut>([]);

const calculating = ref(false);

const calcLohn = () => {
    console.log('calcLohn');
    calculating.value = true;
    result.value = calcLohnabrechnung(data.value);
}

watch(data, () => {
    calcLohn();
    // if (calculating.value) {
    // }
}, { deep: true });

</script>


<template>
    <main>
        <h1 class="text-center mb-4">Lohnrechner</h1>
        <div class="w-full grid grid-cols-2 gap-4 mt-2 mx-auto p-4">
            <form v-auto-animate @submit.prevent="calcLohn" class="flex flex-col gap-2 border-r p-r-2">
                <div>
                    <label for="brutto">Brutto</label>
                    <input type="number" id="brutto" v-model="data.brutto" class="" />
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <label for="fabo">Fabo Plus</label>
                    <input type="checkbox" id="fabo" v-model="data.fabo" class="checkbox checkbox-primary" />
                </div>
                <div v-if="data.fabo" class="flex flex-row gap-2 items-center">
                    <label for="fabo_voll">Fabo 100%</label>
                    <input type="checkbox" id="fabo_voll" v-model="data.fabo_voll" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="avabae">Arbeitsmittel</label>
                    <input type="checkbox" id="avabae" v-model="data.avabae" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="minderj_kinder">Minderjährige Kinder</label>
                    <input type="number" id="minderj_kinder" v-model="data.minderj_kinder" class="" />
                </div>
                <div>
                    <label for="vollj_kinder">Volljährige Kinder</label>
                    <input type="number" id="vollj_kinder" v-model="data.vollj_kinder" class="" />
                </div>
                <!-- <button type="submit" class="btn btn-primary">Berechnen</button> -->
            </form>
            <div>
                {{ result }}
                <!-- <button @click="calculating = false" class="btn btn-primary">Neue Berechnung</button> -->
            </div>
        </div>
    </main>
</template>