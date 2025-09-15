
const groqApiKey = useRuntimeConfig().groqApiKey;

export default defineEventHandler(async (event) => {
    const question = (await readBody(event)).question;
    if (!question) {
        throw createError({ statusCode: 400, statusMessage: 'Question is required' });
    }


});