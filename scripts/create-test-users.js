const { createClient } = require('@supabase/supabase-js')


const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const testUsers = [
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  {
    email: 'student@example.com',
    password: 'student123',
    name: 'Student User'
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User'
  }
]

async function createTestUsers() {
  console.log('Creating test users...\n')

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name
        }
      })

      if (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error.message)
      } else {
        console.log(`✅ Created user: ${user.email} (password: ${user.password})`)
      }
    } catch (err) {
      console.error(`❌ Error creating user ${user.email}:`, err.message)
    }
  }

  console.log('\n🎉 Test user creation complete!')
  console.log('\nYou can now sign in with any of these credentials:')
  testUsers.forEach(user => {
    console.log(`  📧 ${user.email} / 🔑 ${user.password}`)
  })
}

createTestUsers().catch(console.error)