<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { type LstDataOut, calcLohnabrechnung, type LstDataIn } from '~/model/lohnsteuer';
import { genGehaltInputByAi, type Ai } from '~/model/lstAi';

const text = ref("");
const showAi = ref(false);
const ai = useStorage('ai', {
    apiKey: '',
    model: 'llama3-8b-8192',
    id: 1,
    name: 'llama3-8b-8192',
} as Ai);
const aiLoading = ref(false);

const data = ref<LstDataIn>({
    brutto: 1000,
    fabo: false,
    fabo_voll: false,
    avabae: false,
    minderj_kinder: 0,
    vollj_kinder: 0
})

onMounted(() => {
    calcLohn();
})

const result = ref<LstDataOut>([]);

const ueberstunden = ref(false);

const calcLohn = () => {
    result.value = calcLohnabrechnung(data.value);
    console.log(result.value)
}

watch(data, () => {
    calcLohn();
}, { deep: true }); // deep watch for nested objects

const parseAi = async () => {
    aiLoading.value = true;
    const json = await genGehaltInputByAi(text.value, ai.value);
    data.value = json;
    calcLohn();
    aiLoading.value = false;
}

</script>

<template>
    <main class="max-w-full w-[30rem] mt-12 resize-x">
        <p class="mb-4 max-w-4xl">
            Der Lohnrechner berechnet die Lohnsteuer und Sozialabgaben für ein Bruttogehalt. Die Berechnung basiert auf
            den aktuellen Steuergesetzen. Der Lohnrechner berücksichtigt auch Überstunden, FABO Plus, AVAEB, Kinderfreibeträge, Pendlerpauschale und Gewerkschaftsbeiträge. Der Lohnrechner ist ein nützliches Tool für Arbeitnehmer, um ihr Nettogehalt zu berechnen.
        </p>
        <!-- <h1 class="text-center mb-4">Lohnrechner</h1> -->
        <div v-auto-animate class="card bg-slate-200 p-2 max-w-5xl">
            <h2 @click="showAi = !showAi" class="btn btn-primary w-full mt-0">Ai parser</h2>
            <div v-if="showAi" class="mt-1">
                <textarea v-model="text" placeholder="Enter text to parse"
                    class="textarea textarea-bordered textarea-primary w-full"></textarea>
                <div class="w-full flex gap-2 mt-1">
                    <input type="text" v-model="ai.apiKey" class="input input-bordered input-primary"
                        placeholder="API KEY from groq" />
                    <div class="w-40">
                        <button v-if="!aiLoading" @click="parseAi()" class="btn btn-primary w-full">Parse with
                            AI</button>
                        <button v-else class="btn btn-primary w-full">
                            <span class="loading loading-dots loading-sm"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full md:flex gap-4 mt-4">
            <form v-auto-animate @submit.prevent="calcLohn" id="lohnForm"
                class="flex flex-col gap-4 w-full md:max-w-sm p-2">
                <div>
                    <label for="brutto">Brutto</label>
                    <input type="number" id="brutto" v-model="data.brutto" class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="uest?">Überstunden?</label>
                    <input type="checkbox" id="uest?" v-model="ueberstunden" class="checkbox checkbox-primary" />
                </div>
                <template v-if="ueberstunden">
                    <div class="ml-3">
                        <label for="ueberstunden50">Überstunden 50%</label>
                        <input type="number" id="ueberstunden50" v-model="data.ueberstunden50"
                            class="input input-bordered input-primary" />
                    </div>
                    <div class="ml-3">
                        <label for="ueberstunden100">Überstunden 100%</label>
                        <input type="number" id="ueberstunden100" v-model="data.ueberstunden100"
                            class="input input-bordered input-primary" />
                    </div>
                    <div class="ml-3">
                        <label for="ueberstundenTeiler">Überstundenteiler</label>
                        <input type="number" id="ueberstundenTeiler" v-model="data.ueberstundenTeiler"
                            class="input input-bordered input-primary" />
                    </div>
                </template>
                <div>
                    <label for="fabo">Fabo Plus</label>
                    <input type="checkbox" id="fabo" v-model="data.fabo" class="checkbox checkbox-primary" />
                </div>
                <div v-if="data.fabo" class="ml-3">
                    <label for="fabo_voll">Voller FABO?</label>
                    <input type="checkbox" id="fabo_voll" v-model="data.fabo_voll" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="avabae">AVAEB</label>
                    <input type="checkbox" id="avabae" v-model="data.avabae" class="checkbox checkbox-primary" />
                </div>
                <div>
                    <label for="minderj_kinder">Minderjährige Kinder</label>
                    <input type="number" id="minderj_kinder" v-model="data.minderj_kinder"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="vollj_kinder">Volljährige Kinder</label>
                    <input type="number" id="vollj_kinder" v-model="data.vollj_kinder"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="freibetrag">Freibetrag</label>
                    <input type="number" id="freibetrag" v-model="data.freibetrag"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="Pendlerpauschale">Pendlerpauschale</label>
                    <input type="number" id="Pendlerpauschale" v-model="data.pendlerpauschale"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="pendlerentfernung">KM zur Arbeit</label>
                    <input type="number" id="pendlerentfernung" v-model="data.pendlereuro_km"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="kostenuebernahme">Pendlerpauschale Kostenübernahme /Jahr</label>
                    <input type="number" id="kostenuebernahme" v-model="data.pendlerpauschaleKostenUebername"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="gewerkschaftsbeitrag">Gewerkschaftsbeitrag</label>
                    <input type="number" id="gewerkschaftsbeitrag" v-model="data.gewerkschaftsbeitrag"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="serviceentgelt">Servide-Entgelt</label>
                    <input type="number" id="serviceentgelt" v-model="data.serviceentgelt"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="betriebsratsumlage">Betriebsratsumlage</label>
                    <input type="number" id="betriebsratsumlage" v-model="data.betriebsratsumlage"
                        class="input input-bordered input-primary" />
                </div>
                <div>
                    <label for="akonto">Akontozahlung</label>
                    <input type="number" id="akonto" v-model="data.akontozahlung"
                        class="input input-bordered input-primary" />
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
                        <tr v-for="item in result" class="border-b-0" :class="{'border-t border-base-content': item.lineAbove}">
                            <td>{{ item.nameCalc || item.name }}</td>
                            <td class="text-right">
                                <!-- {{ item.value1 }} -->
                                <!-- formated as Currency -->
                                <span v-if="item.value1 !== undefined" class="">
                                    {{ (item.subtract ? '- ' : '') + item.value1.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}
                                </span>
                            </td>
                            <td class="text-right">
                                <!-- {{ item.value2 }} -->
                                <!-- formated as Currency -->
                                <span v-if="item.value2 !== undefined" class="text-right">
                                    {{ (item.subtract ? '- ' : '') + item.value2.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) }}
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
#lohnForm>div {
    display: grid;
    grid-template-columns: 1fr 7rem;
    align-items: center;
    gap: 2rem;
    grid-template-areas: "label input";
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
}
</style>