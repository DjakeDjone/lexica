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

const calcLohn = () => {
    console.log('calcLohn');
    result.value = calcLohnabrechnung(data.value);
}

watch(data, () => {
    calcLohn();
}, { deep: true }); // deep watch for nested objects

</script>

<!-- export interface LstDataIn {
    brutto: number;

    ueberstunden?: number;
    ueberstundenZuschlag?: number;
    ueberstundenTeiler?: number;

    fabo: boolean;
    fabo_voll: boolean;
    avabae: boolean;
    minderj_kinder: number;
    vollj_kinder: number;

    freibetrag?: number;
    pendlerpauschale?: number;
    pendlerpauschaleAbzug?: number;
    pendlereuro_km?: number;

    gewerkschaftsbeitrag?: number;
    betriebsratumlage?: number;
    serviceentgelt?: number;
    akontozahlung?: number;
} -->

<template>
    <main class="max-w-5xl mt-12">
        <!-- <h1 class="text-center mb-4">Lohnrechner</h1> -->
        <div class="w-full md:flex gap-4">
            <form v-auto-animate @submit.prevent="calcLohn" id="lohnForm" 
            class="flex flex-col gap-4 w-full md:max-w-sm">
                <div>
                    <label for="brutto">Brutto</label>
                    <input type="number" id="brutto" v-model="data.brutto" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="ueberstunden">Überstunden</label>
                    <input type="number" id="ueberstunden" v-model="data.ueberstunden" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="ueberstundenZuschlag">Überstunden Zuschlag</label>
                    <input type="number" id="ueberstundenZuschlag" v-model="data.ueberstundenZuschlag" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="ueberstundenTeiler">Überstunden Teiler</label>
                    <input type="number" id="ueberstundenTeiler" v-model="data.ueberstundenTeiler" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="freibetrag" class="text-sm">Freibetrag</label>
                    <input type="number" id="freibetrag" v-model="data.freibetrag" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="gewerkschaftsbeitrag">Gewerkschaftsbeitrag</label>
                    <input type="number" id="gewerkschaftsbeitrag" v-model="data.gewerkschaftsbeitrag" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="Pendlerpauschale">Pendlerpauschale</label>
                    <input type="number" id="Pendlerpauschale" v-model="data.pendlerpauschale" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="pendlerentfernung">KM zur Arbeit</label>
                    <input type="number" id="pendlerentfernung" v-model="data.pendlereuro_km" class="input input-bordered input-primary" />
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
                    <label for="avabae">AVAEB</label>
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
                            <th class="text-right">Lst Berechnung</th>
                            <th class="text-right">Gesamtrechnung</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in result" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td class="text-right">
                                <!-- {{ item.value1 }} -->
                                <!-- formated as Currency -->
                                <span v-if="item.value1" class="">
                                    {{ item.value1.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}
                                </span>
                            </td>
                            <td class="text-right">
                                <!-- {{ item.value2 }} -->
                                <!-- formated as Currency -->
                                <span v-if="item.value2" class="text-right">
                                    {{ item.value2.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}
                                </span>
                            </td>
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