# Lexica

My own lexicon where I push most of my notes from school and all other markdown files I write.

## Features

- Search through all notes (fuzzy search)
- AI assistant (Lexa) that can answer questions based on the notes
- Markdown support with syntax highlighting

## Tech Stack

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Groq API](https://groq.com)

## Setup

1. Clone the repository

```bash
git clone git@github.com:DjakeDjone/lexica.git
```

2. install dependencies

```bash
cd lexica
pnpm i
```

3. Create a `.env` file in the root directory and add your groq key

```
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server

```bash
pnpm dev -o
```

Your ready to write some notes! 📝⭐️

## Usage

- Add your markdown files to the `content` directory
- Use the search bar to find notes
- Use the Lexa AI assistant to ask questions based on your notes
