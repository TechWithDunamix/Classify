FROM ubuntu:latest
FROM python:3.9


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ./backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]