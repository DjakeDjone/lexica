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
        <div class="w-full md:flex gap-4">
            <form v-auto-animate @submit.prevent="calcLohn" id="lohnForm" 
            class="flex flex-col gap-4 w-full md:max-w-sm">
                <div>
                    <label for="brutto">Brutto</label>
                    <input type="number" id="brutto" v-model="data.brutto" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="fabo">Fabo Plus</label>
                    <input type="checkbox" id="fabo" v-model="data.fabo" class="checkbox checkbox-primary" />
                </div>
                <div v-if="data.fabo" class="ml-2">
                    <label for="fabo_voll">Fabo 100%</label>
                    <input type="checkbox" id="fabo_voll" v-model="data.fabo_voll" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="avabae">Arbeitsmittel</label>
                    <input type="checkbox" id="avabae" v-model="data.avabae" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="minderj_kinder">Minderjährige Kinder</label>
                    <input type="number" id="minderj_kinder" v-model="data.minderj_kinder" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="vollj_kinder">Volljährige Kinder</label>
                    <input type="number" id="vollj_kinder" v-model="data.vollj_kinder" class="input input-bordered input-primary" />
                </div>
            </form>
            <div class="w-full border">
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Lst Berechnung</th>
                            <th>Gesamtrechnung</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in result" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td>{{ item.value1 }}</td>
                            <td>{{ item.value2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <p>
            
        </p>
    </main>
</template>

<style scoped>

#lohnForm > div {
    display: grid;
    grid-template-columns: 1fr 7rem;
    align-items: center;
    gap: 2rem;
    grid-template-areas: "label input";
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
}


</style>