/**
 * ADMIN SCRIPT: Clear Supabase Auth Users
 *
 * ⚠️  WARNING: This script uses the service_role key which has FULL DATABASE ACCESS.
 *     NEVER expose this key in client-side code or commit it to version control.
 *
 * Usage:
 *   1. Set environment variables:
 *      export SUPABASE_URL="https://your-project.supabase.co"
 *      export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
 *
 *   2. Run the script:
 *      npm run admin:clear-users
 *
 * To get your service_role key:
 *   - Go to Supabase Dashboard → Settings → API
 *   - Copy the "service_role" key (NOT the anon key)
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

// Read from environment variables
const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validation
if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Missing environment variables!\n')
  console.error('Please set the following environment variables:')
  console.error('  SUPABASE_URL - Your Supabase project URL')
  console.error('  SUPABASE_SERVICE_ROLE_KEY - Your service role key (from Dashboard → Settings → API)\n')
  console.error('Example:')
  console.error('  export SUPABASE_URL="https://xxxxx.supabase.co"')
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="eyJ..."')
  console.error('  npm run admin:clear-users\n')
  process.exit(1)
}

if (!serviceRoleKey.startsWith('eyJ')) {
  console.error('\n❌ Invalid service_role key format!')
  console.error('The service_role key should be a JWT starting with "eyJ..."')
  console.error('Make sure you\'re using the service_role key, NOT the anon key.\n')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  console.log('\n🔐 Supabase Admin: Clear Auth Users')
  console.log('====================================\n')

  // List users
  console.log('Fetching users...\n')

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error('❌ Failed to list users:', listError.message)
    process.exit(1)
  }

  if (!users || users.length === 0) {
    console.log('✅ No users found. Database is already clean.\n')
    process.exit(0)
  }

  console.log(`Found ${users.length} user(s):\n`)
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.email || 'No email'} (ID: ${user.id.slice(0, 8)}...)`)
    console.log(`     Created: ${new Date(user.created_at).toLocaleDateString()}`)
    console.log(`     Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
    console.log('')
  })

  // Confirmation
  const answer = await prompt(
    `⚠️  Are you sure you want to DELETE ALL ${users.length} user(s)? This cannot be undone!\n` +
    `   Type "DELETE" to confirm: `
  )

  if (answer !== 'DELETE') {
    console.log('\n❌ Aborted. No users were deleted.\n')
    process.exit(0)
  }

  // Delete users
  console.log('\nDeleting users...\n')

  let deleted = 0
  let failed = 0

  for (const user of users) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error(`  ❌ Failed to delete ${user.email}: ${deleteError.message}`)
      failed++
    } else {
      console.log(`  ✅ Deleted: ${user.email}`)
      deleted++
    }
  }

  console.log('\n====================================')
  console.log(`✅ Deleted: ${deleted} user(s)`)
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} user(s)`)
  }
  console.log('')
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
