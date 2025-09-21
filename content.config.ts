import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        rawbody: z.string(),
        generateTableOfContents: z.boolean().default(false),

        klasse: z.string().optional(),
        jahrgang: z.number().optional(),
        fach: z.string().optional(),
        thema: z.string().optional(),
        lehrer: z.string().optional(),
        datum: z.string().optional(),

        protocolDescription: z.string().optional(),
        protocolAufgabenNr: z.number().optional(),
        protocolKlasse: z.string().optional(),
        protocolName: z.string().optional(),
        protocolGruppe: z.string().optional(),
        protocolAbgabedatum: z.string().optional(),
        protocolAbgabetermin: z.string().optional(),
      }),
    })
  }
})
