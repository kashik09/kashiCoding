import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'

async function main() {
  console.log('Creating admin user...')

  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('✗ Admin user already exists with email:', email)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'OWNER',
      accountStatus: 'ACTIVE',
      emailVerified: new Date()
    }
  })

  console.log('✓ Admin user created successfully!')
  console.log('  Email:', email)
  console.log('  Password:', password)
  console.log('  Role:', admin.role)
  console.log('\n⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
