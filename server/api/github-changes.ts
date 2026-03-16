import { createError, defineEventHandler } from 'h3'

interface GitHubCommit {
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

interface LatestCommit {
  message: string
  author: string
  date: string
  url: string
}

const CACHE_TTL_MS = 1000 * 60 * 5
let cache: {
  expiresAt: number
  payload: LatestCommit[]
} | null = null

function getGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'lexica-nuxt-app'
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

export default defineEventHandler(async () => {
  const now = Date.now()
  if (cache && cache.expiresAt > now) {
    return cache.payload
  }

  try {
    const response = await fetch('https://api.github.com/repos/DjakeDjone/lexica/commits?per_page=5', {
      headers: getGitHubHeaders()
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch commits: ${response.statusText}`
      })
    }

    const commits = await response.json() as GitHubCommit[]
    const payload: LatestCommit[] = commits.map((commit) => ({
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }))

    cache = {
      expiresAt: now + CACHE_TTL_MS,
      payload
    }

    return payload
  }
  catch (error) {
    if (cache) {
      return cache.payload
    }

    throw error
  }
})
