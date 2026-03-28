import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

async def test_conn():
    try:
        url = 'mongodb+srv://admin:6thSEM_project@cluster0.uq2rzel.mongodb.net/?appName=Cluster0'
        # Try both certifi and tlsAllowInvalidCertificates
        client = AsyncIOMotorClient(url, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("CONNECTION SUCCESSFUL")
    except Exception as e:
        print(f"CONNECTION FAILED: {e}")

asyncio.run(test_conn())
