FROM python:alpine3.9
WORKDIR /app
COPY Python-script/requirements.txt .
RUN pip -m venv venv
RUN . venv/bin/activate
RUN pip install -r requirements.txt
COPY Python-script/. ./app