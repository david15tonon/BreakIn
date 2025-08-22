// scripts/test-connection.ts
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI environment variable is not set')
  console.log('Please check your .env.local file and make sure MONGODB_URI is defined')
  process.exit(1)
}

console.log('🔗 Testing MongoDB connection...')
console.log('URI (masked):', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'))

async function testConnection() {
  const client = new MongoClient(MONGODB_URI as string)
  
  try {
    console.log('⏳ Attempting to connect...')
    
    // Set a timeout for the connection
    await client.connect()
    console.log('✅ Connected to MongoDB successfully!')
    
    // Test database access
    const db = client.db('breakin_direct')
    console.log('📁 Connected to database: breakin_direct')
    
    // List collections
    try {
      const collections = await db.listCollections().toArray()
      console.log('📂 Available collections:', collections.map(c => c.name))
    } catch (listError) {
      console.log('⚠️  Could not list collections (may be empty database)')
    }
    
    // Test a simple operation
    const testCollection = db.collection('connection_test')
    
    // Test write operation
    console.log('📝 Testing write operation...')
    const writeResult = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful'
    })
    console.log('✅ Write operation successful! ID:', writeResult.insertedId)
    
    // Test read operation
    console.log('📖 Testing read operation...')
    const readResult = await testCollection.findOne({ _id: writeResult.insertedId })
    console.log('✅ Read operation successful:', readResult?.message)
    
    // Test delete operation
    console.log('🗑️  Testing delete operation...')
    const deleteResult = await testCollection.deleteOne({ _id: writeResult.insertedId })
    console.log('✅ Delete operation successful! Deleted count:', deleteResult.deletedCount)
    
    // Test connection speed
    console.log('⚡ Testing connection speed...')
    const startTime = Date.now()
    await db.admin().ping()
    const endTime = Date.now()
    console.log(`✅ Ping successful! Response time: ${endTime - startTime}ms`)
    
    console.log('\n🎉 All tests passed! MongoDB connection is working perfectly.')
    
    // Show connection info
    console.log('\n📊 Connection Details:')
    console.log('- Database: breakin_direct')
    console.log('- Cluster: BreakInCluster')
    console.log('- Connection: Successful')
    console.log('- Operations: All working')
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!')
    console.error('Error details:', error)
    
    if (error instanceof Error) {
      console.log('\n🔧 Troubleshooting based on error type:')
      
      if (error.message.includes('ETIMEOUT') || error.message.includes('timeout')) {
        console.log('⏰ TIMEOUT ERROR - This usually means:')
        console.log('   1. Your IP address is not whitelisted in MongoDB Atlas')
        console.log('   2. Network/firewall is blocking the connection')
        console.log('   3. The cluster might be paused')
        console.log('\n   Solutions:')
        console.log('   • Go to MongoDB Atlas → Network Access → Add IP → 0.0.0.0/0')
        console.log('   • Check if your cluster is running (not paused)')
        console.log('   • Try a different network (mobile hotspot)')
      }
      
      if (error.message.includes('Authentication failed') || error.message.includes('auth')) {
        console.log('🔐 AUTHENTICATION ERROR - This usually means:')
        console.log('   1. Wrong username or password')
        console.log('   2. User doesn\'t have proper permissions')
        console.log('\n   Solutions:')
        console.log('   • Check your MongoDB Atlas username and password')
        console.log('   • Make sure user has "Read and write to any database" permissions')
        console.log('   • Try creating a new database user')
      }
      
      if (error.message.includes('ENOTFOUND') || error.message.includes('hostname')) {
        console.log('🌐 DNS/HOSTNAME ERROR - This usually means:')
        console.log('   1. Incorrect cluster hostname in connection string')
        console.log('   2. DNS resolution issues')
        console.log('\n   Solutions:')
        console.log('   • Double-check your MongoDB connection string')
        console.log('   • Try using Google DNS (8.8.8.8)')
      }
    }
    
    console.log('\n📋 Quick Checklist:')
    console.log('□ MongoDB Atlas cluster is running (not paused)')
    console.log('□ IP address 0.0.0.0/0 is in Network Access list')
    console.log('□ Database user exists with correct password')
    console.log('□ User has "Read and write to any database" permissions')
    console.log('□ Connection string is correctly formatted')
    console.log('□ .env.local file exists with MONGODB_URI')
    
  } finally {
    try {
      await client.close()
      console.log('🔌 Connection closed.')
    } catch (closeError) {
      console.log('⚠️  Error closing connection:', closeError)
    }
  }
}

// Additional network diagnostics
async function networkDiagnostics() {
  console.log('\n🔍 Running network diagnostics...')
  
  // Test basic internet connectivity
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    console.log('✅ Internet connection: Working')
  } catch (netError) {
    console.log('❌ Internet connection: Failed')
    console.log('   Check your internet connection first')
    return
  }
  
  // Test if we can reach MongoDB's domain
  try {
    const mongoResponse = await fetch('https://cloud.mongodb.com', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    })
    console.log('✅ MongoDB Atlas reachable: Yes')
  } catch (mongoNetError) {
    console.log('❌ MongoDB Atlas reachable: No')
    console.log('   Your network might be blocking MongoDB connections')
  }
  
  console.log('✅ Network diagnostics complete\n')
}

// Main execution
async function runTests() {
  console.log('🧪 Starting MongoDB connection tests...\n')
  
  await networkDiagnostics()
  await testConnection()
}

if (require.main === module) {
  runTests()
}