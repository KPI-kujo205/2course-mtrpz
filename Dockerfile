FROM python:3.10-slim-buster

WORKDIR /app

COPY ./requirements/backend.in ./requirements/backend.in

RUN pip install --no-cache-dir -r requirements/backend.in

COPY . .

CMD ["uvicorn", "spaceship.main:app", "--host=0.0.0.0", "--port=8080"]

