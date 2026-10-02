# Use the official slim Node.js image as a base image.
FROM node:18-slim

# Install necessary dependencies and libraries
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-glib-1-2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Chromium (needed for Puppeteer)
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install unrtf
RUN apt-get update && apt-get install -y unrtf

# Install fonts to support multiple languages
RUN apt-get update && apt-get install -y \
    fonts-noto-cjk        # For Chinese, Japanese, Korean
RUN apt-get update && apt-get install -y \
    fonts-noto-cjk-extra  # Improves coverage of East Asia characters
RUN apt-get update && apt-get install -y \
    fonts-noto-color-emoji  # Emojis
RUN apt-get update && apt-get install -y \
    fonts-noto-core      # For Latin, Cyrillic, Greek, and others
RUN apt-get update && apt-get install -y \
    fonts-noto-unhinted  # Expands support for additional languages
RUN apt-get update && apt-get install -y \
    fonts-dejavu         # Good fallback fonts for missing glyphs
RUN apt-get update && apt-get install -y \
    ttf-wqy-zenhei       # For simplified Chinese (font widely used in Chinese locales)
RUN apt-get update && apt-get install -y \
    fonts-arphic-ukai fonts-arphic-uming # Additional Chinese fonts
RUN apt-get update && apt-get install -y \
    fonts-farsiweb       # For Persian/Farsi/Urdu
RUN apt-get update && apt-get install -y \
    fonts-kacst          # For Arabic script text
RUN apt-get update && apt-get install -y \
    fonts-sil-abyssinica # Amharic and other Ethiopic scripts
RUN apt-get update && apt-get install -y \
    fonts-lohit-guru fonts-lohit-deva # Indian languages like Hindi, Punjabi


WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY prisma/schema.prisma /app

RUN yarn install --production
# Generate Prisma Client
RUN npx prisma generate

COPY . /app

ENV CLOUD_ENV=production \
    ALLOWED_ORIGINS=http://localhost:3000

CMD [ "yarn", "start" ]
