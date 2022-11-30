FROM python:3.8-slim-buster
WORKDIR /app
COPY Python-script/requirements.txt requirements.txt 
RUN python3 -m venv venv
RUN . venv/bin/activate
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
COPY Python-script/. ./app