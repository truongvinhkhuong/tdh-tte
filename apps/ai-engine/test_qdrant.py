from qdrant_client import QdrantClient
try:
    client = QdrantClient(
        url="https://b2291bb3-bd39-42c2-b3e0-346df52179b1.us-east4-0.gcp.cloud.qdrant.io:6333",
        api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.s0PaQ5G5lMT8kf2w3xGQaoSW4ICcCojRKFEDn0Dp2uo"
    )
    print(client.get_collections())
except Exception as e:
    print("Error:", e)

