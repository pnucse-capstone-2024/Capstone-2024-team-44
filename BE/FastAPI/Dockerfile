FROM python:3.9

WORKDIR /project

COPY ./requirements.txt /project/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /project/requirements.txt

COPY ./app/.env /project/app/.env

COPY ./app /project/app

ENV PYTHONPATH=/project

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]