from openbb_payday.database import create_tables
from openbb_core.api.rest_api import app
import uvicorn

if __name__ == "__main__":
    create_tables()
    uvicorn.run(app, host="0.0.0.0", port=8000)
