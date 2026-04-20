#!/usr/bin/env node
// Sync event markdown files between local disk and Supabase Storage.
//
// Usage:
//   node --env-file=.env.local scripts/sync-events.mjs pull
//   node --env-file=.env.local scripts/sync-events.mjs push
//   node --env-file=.env.local scripts/sync-events.mjs push day-1/event-2.md
//
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (not the anon key).
// Find it at: Supabase dashboard → Project Settings → API → service_role

import { createClient } from '@supabase/supabase-js'
import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises'
import { join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOCAL_DIR = join(ROOT, 'content', 'events')
const BUCKET = 'events'

// --- Supabase client (service role) ---

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase dashboard → Project Settings → API → service_role).')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

// --- Helpers ---

/**
 * Recursively list all files in a storage bucket prefix.
 * Returns an array of full storage paths (e.g. "day-1/event-2.md").
 */
async function listAll(prefix = '') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 })
  if (error) throw new Error(`Failed to list storage at "${prefix}": ${error.message}`)

  const files = []
  for (const item of data ?? []) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name
    if (item.id === null) {
      // folder — recurse
      const nested = await listAll(itemPath)
      files.push(...nested)
    } else {
      files.push(itemPath)
    }
  }
  return files
}

/**
 * Recursively walk a local directory, returning all file paths.
 */
async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkDir(full))
    } else {
      files.push(full)
    }
  }
  return files
}

// --- Commands ---

async function pull() {
  console.log(`Pulling from bucket "${BUCKET}" → ${LOCAL_DIR}\n`)
  const paths = await listAll()

  if (paths.length === 0) {
    console.log('No files found in bucket.')
    return
  }

  for (const storagePath of paths) {
    const { data, error } = await supabase.storage.from(BUCKET).download(storagePath)
    if (error || !data) {
      console.error(`  ✗ ${storagePath} — ${error?.message ?? 'empty response'}`)
      continue
    }

    const localPath = join(LOCAL_DIR, storagePath)
    await mkdir(dirname(localPath), { recursive: true })
    await writeFile(localPath, Buffer.from(await data.arrayBuffer()))
    console.log(`  ✓ ${storagePath}`)
  }

  console.log(`\nDone. ${paths.length} file(s) downloaded to content/events/`)
}

async function pushFile(storagePath, localPath) {
  const buffer = await readFile(localPath)
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    upsert: true,
    contentType: 'text/markdown',
  })
  if (error) {
    console.error(`  ✗ ${storagePath} — ${error.message}`)
  } else {
    console.log(`  ✓ ${storagePath}`)
  }
}

async function push(singleFile) {
  if (singleFile) {
    // Resolve the storage path from the argument
    // Accept either a path relative to content/events/ or an absolute local path
    let localPath
    let storagePath

    if (singleFile.startsWith('/') || singleFile.startsWith('\\')) {
      localPath = singleFile
      storagePath = relative(LOCAL_DIR, localPath).replace(/\\/g, '/')
    } else {
      // Treat as a storage path (relative to content/events/)
      storagePath = singleFile.replace(/\\/g, '/')
      localPath = join(LOCAL_DIR, storagePath)
    }

    console.log(`Pushing ${storagePath} → bucket "${BUCKET}"\n`)
    await pushFile(storagePath, localPath)
    console.log('\nDone.')
    return
  }

  console.log(`Pushing content/events/ → bucket "${BUCKET}"\n`)

  let localFiles
  try {
    localFiles = await walkDir(LOCAL_DIR)
  } catch {
    console.error(`Local directory not found: ${LOCAL_DIR}`)
    console.error('Run "npm run events:pull" first to create it.')
    process.exit(1)
  }

  if (localFiles.length === 0) {
    console.log('No local files found.')
    return
  }

  for (const localPath of localFiles) {
    const storagePath = relative(LOCAL_DIR, localPath).replace(/\\/g, '/')
    await pushFile(storagePath, localPath)
  }

  console.log(`\nDone. ${localFiles.length} file(s) uploaded.`)
}

// --- Entry point ---

const [, , command, arg] = process.argv

if (command === 'pull') {
  await pull()
} else if (command === 'push') {
  await push(arg)
} else {
  console.error('Usage: sync-events.mjs pull | push [file]')
  process.exit(1)
}
