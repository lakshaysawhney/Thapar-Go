# Base image
FROM python:3.10-slim 

# Setting ENV variables
ENV PYTHONDONTWRITEBYTECODE = 1
# ^prevents Python from writing .pyc files to disk.
ENV PYTHONUNBUFFERED = 1
# ^logs output directly to console

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the entire Django project into the working directory
COPY . /app/

CMD ["gunicorn", "Transport_Pool.wsgi:application", "--bind", "0.0.0.0:8000"]