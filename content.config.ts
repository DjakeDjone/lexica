import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        generateTableOfContents: z.boolean().default(false),
        
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
