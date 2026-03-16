import { createError, defineEventHandler } from 'h3'

interface GitHubCommit {
  sha: string
  url: string
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

interface GitHubCommitDetail {
  files?: Array<{
    filename: string
  }>
}

interface LatestCommit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

interface LatestContentFile {
  path: string
  route: string
}

interface LatestChangesPayload {
  generatedAt: string
  commits: LatestCommit[]
  contentFiles: LatestContentFile[]
}

const GITHUB_API = 'https://api.github.com/repos/DjakeDjone/lexica'
const MAX_COMMITS = 8
const MAX_CONTENT_FILES = 12
const CACHE_TTL_MS = 1000 * 60 * 5

let cache: {
  expiresAt: number
  payload: LatestChangesPayload
} | null = null

function toContentRoute(filePath: string): string {
  const withoutContent = filePath.replace(/^content\//, '')
  const withoutExtension = withoutContent.replace(/\.md$/i, '')
  if (withoutExtension.endsWith('/index')) {
    return `/${withoutExtension.replace(/\/index$/, '')}`
  }
  return `/${withoutExtension}`
}

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: getGitHubHeaders() })
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `GitHub request failed: ${response.statusText}`
    })
  }

  return response.json() as Promise<T>
}

export default defineEventHandler(async () => {
  const now = Date.now()
  if (cache && cache.expiresAt > now) {
    return cache.payload
  }

  try {
    const commits = await fetchJson<GitHubCommit[]>(`${GITHUB_API}/commits?per_page=${MAX_COMMITS}`)

    const latestCommits: LatestCommit[] = commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }))

    const detailResponses = await Promise.allSettled(
      commits.map((commit) => fetchJson<GitHubCommitDetail>(commit.url))
    )

    const contentPaths = new Set<string>()
    for (const result of detailResponses) {
      if (result.status !== 'fulfilled') {
        continue
      }

      for (const file of result.value.files ?? []) {
        const isMarkdown = file.filename.endsWith('.md')
        if (isMarkdown && file.filename.startsWith('content/')) {
          contentPaths.add(file.filename)
        }
      }
    }

    const contentFiles: LatestContentFile[] = Array.from(contentPaths)
      .slice(0, MAX_CONTENT_FILES)
      .map((path) => ({
        path,
        route: toContentRoute(path)
      }))

    const payload: LatestChangesPayload = {
      generatedAt: new Date().toISOString(),
      commits: latestCommits,
      contentFiles
    }

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
